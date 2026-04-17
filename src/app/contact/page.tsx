import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Box } from "@/components/Box";
import { Field } from "@/components/Field";
import { site } from "@/content/site";

export const metadata: Metadata = {
    title: "Contact",
};

export default function ContactPage(): ReactNode {
    return (
        <div className="flex flex-col gap-6">
            <Box title="CONTACT">
                <div className="flex flex-col gap-1">
                    <Field label="EMAIL">
                        <a href={`mailto:${site.email}`}>{site.email}</a>
                    </Field>
                    {site.socials.map((s) => (
                        <Field key={s.label} label={s.label}>
                            <a href={s.href} target="_blank" rel="noreferrer noopener">
                                {s.value}
                            </a>
                        </Field>
                    ))}
                    <Field label="LOCATION">{site.location}</Field>
                    <Field label="TZ">{site.timezone}</Field>
                </div>
            </Box>
            <p className="text-xs text-fg-muted">
                {"// write plaintext. I read it."}
            </p>
        </div>
    );
}
