import type { ReactNode } from "react";
// import { AsciiPortrait } from "@/components/AsciiPortrait";
import { Box } from "@/components/Box";
import { Field } from "@/components/Field";
import { RecentList } from "@/components/RecentList";
import { Terminal } from "@/components/Terminal";
import { listPostMeta } from "@/lib/posts";
import { buildVirtualFs } from "@/lib/virtual-fs";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { PictureRenderer } from "@/components/PictureRenderer";

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
  const [posts, fs] = await Promise.all([listPostMeta(), buildVirtualFs()]);
  return (
    <div className="flex flex-col gap-8">
      <section>
        {/* Font size and line height live on the row so the portrait can be
            sized in banner lines (lh): it spans the 7 rows of "James" and
            sits 2 rows above the banner's bottom edge, clear of the "g". */}
        <div className="flex items-end gap-4 text-[9px] leading-[1.1] sm:text-[11px]">
          {/* <div className="mb-[2lh] h-[7lh] w-[7lh] shrink-0"> */}
            {/* <AsciiPortrait className="text-fg-dim h-full w-full" /> */}
            <div className="mb-7.5">
              <PictureRenderer picturePath="/pictures/james-headshot.jpg" preload={true} width={120} height={120} alt="Personal Portrait Picture of James Dong" />
            </div>
          {/* </div> */}
          <pre className="text-fg min-w-0 flex-1 overflow-x-auto overflow-y-hidden whitespace-pre">
            {banner}
          </pre>
        </div>
        <p className="text-fg-dim mt-6 text-sm">
          <span className="text-fg-muted">$</span> whoami — software engineer /{" "}
          {site.location} / Running, Fishing, Cars.
        </p>
        <Terminal fs={fs} user={site.handle} host={site.hostname} />
        <p className="text-fg-muted mt-1 text-xs">
          {"// type `help` to get started"}
        </p>
        <p className="text-fg-muted text-xs">
          {"// try `cat me.txt` in the terminal"}
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
