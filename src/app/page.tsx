import type { ReactNode } from "react";
import { Box } from "@/components/Box";
import { Field } from "@/components/Field";
import { RecentList } from "@/components/RecentList";
import { Terminal } from "@/components/Terminal";
import { listPosts } from "@/lib/posts";
import { buildVirtualFs } from "@/lib/virtual-fs";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

const banner = `
   \`7MMF'                                              \`7MM"""Yb.
     MM                                                  MM    \`Yb.
     MM  ,6"Yb.  \`7MMpMMMb.pMMMb.  .gP"Ya  ,pP"Ybd       MM     \`Mb  ,pW"Wq.\`7MMpMMMb.  .P"Ybmmm
     MM 8)   MM    MM    MM    MM ,M'   Yb 8I   \`"       MM      MM 6W'   \`Wb MM    MM :MI  I8
     MM  ,pm9MM    MM    MM    MM 8M"""""" \`YMMMa.       MM     ,MP 8M     M8 MM    MM  WmmmP"
(O)  MM 8M   MM    MM    MM    MM YM.    , L.   I8       MM    ,dP' YA.   ,A9 MM    MM 8M
 Ymmm9  \`Moo9^Yo..JMML  JMML  JMML.\`Mbmmd' M9mmmP'     .JMMmmmdP'    \`Ybmd9'.JMML  JMML.YMMMMMb
                                                                                       6'     dP
                                                                                       Ybmmmd'
`;

export default async function HomePage(): Promise<ReactNode> {
  const [posts, fs] = await Promise.all([listPosts(), buildVirtualFs()]);
  return (
    <div className="flex flex-col gap-8">
      <section>
        <pre className="text-fg md:text-2xs overflow-x-auto text-[9px] leading-[1.1] whitespace-pre sm:text-[11px]">
          {banner}
        </pre>
        <p className="text-fg-dim mt-2 text-sm">
          <span className="text-fg-muted">$</span> whoami — software engineer /{" "}
          {site.location} / building calm software.
        </p>
        <Terminal fs={fs} user={site.handle} host={site.hostname} />
        <p className="text-fg-muted mt-1 text-xs">
          {"// type `help` to get started"}
        </p>
      </section>

      <Box title="BIO">
        <ul className="flex flex-col gap-1 text-base">
          {site.bio.map((line) => (
            <li key={line}>
              <span className="text-fg-muted">&gt; </span>
              {line}
            </li>
          ))}
        </ul>
      </Box>

      <Box title="META">
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

      <Box title="RECENT">
        <RecentList posts={posts} projects={projects} />
      </Box>

      <p className="text-fg-muted text-xs">
        {"// end of file. Press F10 to exit."}
      </p>
    </div>
  );
}
