"use client";

import { useEffect, useState } from "react";

/**
 * État de formulaire pré-rempli à partir de l'horloge, sans casser l'hydratation.
 *
 * Les pages outils sont prérendues au build (`generateStaticParams`). Une valeur
 * calculée depuis `Date` pendant le rendu serait donc figée à la date du build
 * dans le HTML servi, puis recalculée à l'hydratation : React verrait deux
 * valeurs différentes et jetterait le HTML serveur. Pour l'horodatage, où la
 * valeur descend à la minute, l'écart est systématique.
 *
 * On rend donc une chaîne vide au premier passage — identique serveur et client —
 * puis on renseigne la valeur réelle une fois monté.
 */
export function useClockSeededState(compute: () => string) {
  const [value, setValue] = useState("");

  useEffect(() => {
    // Le seul moyen de produire une valeur client-only sans divergence : elle ne
    // peut pas exister au premier rendu, donc elle arrive nécessairement après.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(compute());
    // `compute` est volontairement hors dépendances : on ne veut qu'un amorçage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [value, setValue] as const;
}
