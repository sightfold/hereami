"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import ColorField from "@/components/admin/ColorField";
import LogoField from "@/components/admin/LogoField";
import OrgMark from "@/components/layout/OrgMark";
import Field from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import { readableOn } from "@/utils/color";
import type { BrandingForm } from "@/utils/schemas";

const BrandFields = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<BrandingForm>();
  const name = useWatch({ control, name: "name" });
  const color = useWatch({ control, name: "brandColor" });
  const logo = useWatch({ control, name: "logo" });
  const isHex = /^#[0-9a-f]{6}$/i.test(color);

  return (
    <>
      <Field label="Organization name" error={errors.name?.message}>
        <Input {...register("name")} />
      </Field>
      <Controller
        control={control}
        name="logo"
        render={({ field }) => (
          <LogoField name={name} value={field.value} color={color} onChange={field.onChange} />
        )}
      />
      <Controller
        control={control}
        name="brandColor"
        render={({ field }) => (
          <ColorField
            value={field.value}
            onChange={field.onChange}
            error={errors.brandColor?.message}
          />
        )}
      />
      <div className="flex items-center gap-3 rounded-2xl border border-line p-3">
        <OrgMark name={name || "?"} logo={logo} color={color} className="size-9" />
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">
          {name || "Your organization"}
        </span>
        {isHex && (
          <span
            style={{ backgroundColor: color, color: readableOn(color) }}
            className="shrink-0 rounded-full px-3 py-1 text-xs font-medium"
          >
            Check in
          </span>
        )}
      </div>
    </>
  );
};

export default BrandFields;
