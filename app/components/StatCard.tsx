import Card from "./Card";
import { numeral, type } from "./type";

type Props = { label: string; value: string; note?: string };

export default function StatCard({ label, value, note }: Props) {
  return (
    <Card aria-label={label}>
      <p className={`${type.label} text-ln-muted`}>{label}</p>
      <p className={`${numeral} mt-2 sm:mt-3`}>{value}</p>
      {note && <p className={`${type.bodySmall} mt-2 text-ln-muted sm:mt-3`}>{note}</p>}
    </Card>
  );
}
