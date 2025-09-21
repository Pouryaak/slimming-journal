import { Input } from '../ui/input';

const normalize = (v: unknown) =>
  v === undefined || v === null ? '' : (v as string | number);

function NumberField(props: {
  field: ReturnType<typeof Object>;
  placeholder?: string;
  min?: number;
  step?: number;
  id?: string;
}) {
  const { field, placeholder, min = 0, step = 1, id } = props;
  return (
    <Input
      id={id}
      type="number"
      inputMode="numeric"
      pattern="[0-9]*"
      min={min}
      step={step}
      placeholder={placeholder}
      onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
      {...field}
      value={normalize(field.value)}
    />
  );
}

export default NumberField;
