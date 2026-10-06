"use server";

import {
  deleteClient,
  deleteFaq,
  deleteSocialLink,
  saveClient,
  saveFaq,
  saveSocialLink,
  updateService,
  updateSiteSettings,
  type ActionResult,
} from "./admin";

/**
 * Envoltorios con la firma que espera useActionState: (estado, formData).
 * El identificador del registro viaja en un campo oculto `id`, de modo que un
 * mismo formulario sirve para crear y para editar.
 */

const readId = (formData: FormData): string | null => {
  const value = formData.get("id");
  const id = typeof value === "string" ? value.trim() : "";
  return id.length ? id : null;
};

export async function saveServiceForm(
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = readId(formData);
  if (!id) return { ok: false, message: "Falta el identificador del servicio." };
  return updateService(id, formData);
}

export async function saveClientForm(
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return saveClient(readId(formData), formData);
}

export async function deleteClientForm(
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = readId(formData);
  if (!id) return { ok: false, message: "Falta el identificador del cliente." };
  return deleteClient(id);
}

export async function saveFaqForm(
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return saveFaq(readId(formData), formData);
}

export async function deleteFaqForm(
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = readId(formData);
  if (!id) return { ok: false, message: "Falta el identificador de la pregunta." };
  return deleteFaq(id);
}

export async function saveSocialLinkForm(
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return saveSocialLink(readId(formData), formData);
}

export async function deleteSocialLinkForm(
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = readId(formData);
  if (!id) return { ok: false, message: "Falta el identificador de la red social." };
  return deleteSocialLink(id);
}

export async function updateSiteSettingsForm(
  _state: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  return updateSiteSettings(formData);
}
