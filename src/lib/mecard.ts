import { escapeMeCard } from "./escape";
import { err, ok, type BuildResult } from "./payload";

export interface MeCardInput {
  readonly firstName: string;
  readonly lastName: string;
  readonly phone: string;
  readonly email: string;
  readonly url: string;
}

/**
 * MeCard payload: `MECARD:N:<last>,<first>;TEL:...;EMAIL:...;URL:...;;`.
 * The name uses a comma to separate last and first. At least one name part is
 * required. Optional fields are emitted only when present. Every value is
 * escaped for the reserved characters `\ ; : ,`. Terminated with `;;`.
 */
export function buildMeCard(input: MeCardInput): BuildResult {
  const first = input.firstName.trim();
  const last = input.lastName.trim();
  if (first.length === 0 && last.length === 0) {
    return err("mecard.name.empty", "A first or last name is required");
  }

  const name = `${escapeMeCard(last)},${escapeMeCard(first)}`;
  const fields: string[] = [`N:${name}`];

  const phone = input.phone.trim();
  if (phone.length > 0) fields.push(`TEL:${escapeMeCard(phone)}`);

  const email = input.email.trim();
  if (email.length > 0) fields.push(`EMAIL:${escapeMeCard(email)}`);

  const url = input.url.trim();
  if (url.length > 0) fields.push(`URL:${escapeMeCard(url)}`);

  return ok(`MECARD:${fields.join(";")};;`);
}
