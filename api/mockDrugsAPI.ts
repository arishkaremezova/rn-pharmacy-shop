import data from '../mocks/db.json';
import { Drug } from '../types/drug';

const delay = () => new Promise<void>((resolve) => setTimeout(resolve, 400));

export async function fetchDrugs(): Promise<Drug[]> {
  await delay();
  return data.drugs;
}

export async function fetchDrugById(id: string): Promise<Drug | undefined> {
  await delay();
  return data.drugs.find((drug) => drug.id === id);
}
