import { mockCitizens } from '../../data/mock';
import { defaultCitizen, normalizeCitizen, type CitizenRecord } from './types';

let citizenState: CitizenRecord[] = mockCitizens.map((item) => normalizeCitizen(item));

export function getCitizens() {
  return [...citizenState];
}

export function getCitizenById(id: string) {
  return citizenState.find((item) => item.id === id) ?? null;
}

export function saveCitizen(citizen: CitizenRecord) {
  const nextCitizen = normalizeCitizen({
    ...defaultCitizen(),
    ...citizen,
    id: citizen.id || Date.now().toString(),
  });

  const exists = citizenState.some((item) => item.id === nextCitizen.id);
  citizenState = exists
    ? citizenState.map((item) => (item.id === nextCitizen.id ? nextCitizen : item))
    : [nextCitizen, ...citizenState];
}

export function deleteCitizen(id: string) {
  citizenState = citizenState.filter((item) => item.id !== id);
}
