import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { watchTcf, type TcfState } from "@/lib/tcf";

type Listener = (data: unknown, success: boolean) => void;

/**
 * Fausse fenêtre exposant une `__tcfapi` pilotable.
 *
 * `emit` rejoue ce qu'une CMP enverrait à ses abonnés, ce qui permet de vérifier
 * la machine à états sans navigateur ni CMP réelle.
 */
function fakeWindow(withApi: boolean) {
  const listeners: Listener[] = [];
  const api = (command: string, _v: number, cb: Listener) => {
    if (command === "addEventListener") listeners.push(cb);
  };
  return {
    win: {
      ...(withApi ? { __tcfapi: api } : {}),
      setTimeout: (fn: () => void, ms: number) => setTimeout(fn, ms),
      clearTimeout: (id: number) => clearTimeout(id),
    },
    emit: (data: unknown, success = true) => listeners.forEach((l) => l(data, success)),
  };
}

function collect(withApi: boolean) {
  const { win, emit } = fakeWindow(withApi);
  vi.stubGlobal("window", win);
  const states: TcfState[] = [];
  const stop = watchTcf((s) => states.push(s));
  return { states, emit, stop };
}

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("absence de CMP", () => {
  it("rend la main à notre bannière après le délai court", () => {
    const { states, stop } = collect(false);

    vi.advanceTimersByTime(2500);
    expect(states).toEqual([]);

    vi.advanceTimersByTime(1000);
    expect(states).toEqual([{ kind: "absent" }]);

    stop();
  });

  it("ne signale l'absence qu'une seule fois", () => {
    const { states, stop } = collect(false);
    vi.advanceTimersByTime(20000);
    expect(states.filter((s) => s.kind === "absent")).toHaveLength(1);
    stop();
  });
});

describe("CMP présente", () => {
  it("« tcloaded » sans chaîne de consentement n'est pas un refus", () => {
    // Le cas qui avait échappé : une CMP dont le message n'est pas publié
    // s'initialise sans rien à dire. Le prendre pour une décision masquait notre
    // bannière, et plus personne n'était interrogé.
    const { states, emit, stop } = collect(true);

    emit({ eventStatus: "tcloaded", gdprApplies: true, purpose: { consents: {} } });
    expect(states).toEqual([]);

    vi.advanceTimersByTime(4000);
    expect(states).toEqual([{ kind: "absent" }]);

    stop();
  });

  it("un événement en échec arme aussi le repli", () => {
    const { states, emit, stop } = collect(true);

    emit({}, false);
    expect(states).toEqual([]);

    vi.advanceTimersByTime(4000);
    expect(states).toEqual([{ kind: "absent" }]);

    stop();
  });

  it("un choix utilisateur fait autorité", () => {
    const { states, emit, stop } = collect(true);

    emit({
      eventStatus: "useractioncomplete",
      gdprApplies: true,
      tcString: "CPabc",
      purpose: { consents: { 1: true } },
    });

    expect(states).toEqual([{ kind: "decided", storageConsent: true }]);
    stop();
  });

  it("une chaîne enregistrée lors d'une visite antérieure vaut verdict", () => {
    const { states, emit, stop } = collect(true);

    emit({
      eventStatus: "tcloaded",
      gdprApplies: true,
      tcString: "CPabc",
      purpose: { consents: { 1: false } },
    });

    expect(states).toEqual([{ kind: "decided", storageConsent: false }]);
    stop();
  });

  it("l'interface ouverte suspend tout affichage de notre côté", () => {
    const { states, emit, stop } = collect(true);

    emit({ eventStatus: "cmpuishown", gdprApplies: true });
    expect(states).toEqual([{ kind: "pending" }]);

    // Aucun repli ne doit survenir pendant que la CMP est à l'écran.
    vi.advanceTimersByTime(20000);
    expect(states).toEqual([{ kind: "pending" }]);

    stop();
  });

  it("un verdict arrivant après une attente annule le repli", () => {
    const { states, emit, stop } = collect(true);

    emit({ eventStatus: "tcloaded", gdprApplies: true });
    vi.advanceTimersByTime(2000);

    emit({ eventStatus: "cmpuishown", gdprApplies: true });
    emit({
      eventStatus: "useractioncomplete",
      gdprApplies: true,
      tcString: "CPxyz",
      purpose: { consents: { 1: true } },
    });

    vi.advanceTimersByTime(20000);
    expect(states).toEqual([
      { kind: "pending" },
      { kind: "decided", storageConsent: true },
    ]);

    stop();
  });

  it("hors champ du RGPD, notre bannière reprend la main", () => {
    const { states, emit, stop } = collect(true);

    emit({ eventStatus: "tcloaded", gdprApplies: false });
    expect(states).toEqual([{ kind: "absent" }]);

    stop();
  });
});
