export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "italic"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; caption: string };

export type ProjectSection = {
  id: string;
  label: string;
  content?: ContentBlock[];
};

export type ProjectMeta = {
  role: string[];
  team: string[];
  timeline: string;
  skills: string[];
};

export type Project = {
  slug: string;
  title: string;
  badge: string;
  tags: string[];
  gradient: string;
  meta: ProjectMeta;
  sections: ProjectSection[];
};

const defaultSections: ProjectSection[] = [
  { id: "overview", label: "Overview" },
  { id: "contributions", label: "My Contributions" },
  { id: "details", label: "Details" },
];

const placeholderMeta = (skills: string[]): ProjectMeta => ({
  role: ["[Add role]"],
  team: ["[Add team]"],
  timeline: "[Add timeline]",
  skills,
});

export const projects: Project[] = [
  {
    slug: "discify",
    title: "discify",
    badge: "Case Study Draft",
    tags: ["JavaScript", "Spicetify", "UI Design"],
    gradient: "from-violet-500 via-purple-400 to-fuchsia-300",
    meta: placeholderMeta(["JavaScript", "Spicetify", "UI Design"]),
    sections: [
      {
        id: "overview",
        label: "Overview",
        content: [
          {
            type: "p",
            text: "discify is a Spicetify extension that turns fully listening to a Spotify album into something collectible: a CD-shaped badge, awarded only when you've actually played through the whole thing. It lives on the album page and on your profile, and tracks progress in real time as you listen.",
          },
          {
            type: "italic",
            text: "Role: solo designer/developer. Tools: Spicetify, JavaScript.",
          },
          {
            type: "image",
            caption: "discify badge live on a Spotify album page",
          },
        ],
      },
      {
        id: "problem",
        label: "Problem",
        content: [
          {
            type: "p",
            text: "Spotify has no concept of \"finishing\" an album. You can skip through half a tracklist and it counts the same as a full listen. There's no distinction, no record, nothing to mark the difference between putting on background noise and actually sitting with a record start to finish. discify adds that missing signal — for people who still think of albums as complete works, not shuffle fodder.",
          },
        ],
      },
      {
        id: "process",
        label: "Process & Key Decisions",
        content: [
          {
            type: "p",
            text: "**Defining \"complete.\"** The first real decision was what \"finished an album\" actually means. Skipping to the end of a track shouldn't count, so I set a 90%-played threshold per track, and an album only becomes complete once every track clears it. It's a small buffer that filters out accidental skips or a song cutting off near the end, without requiring an unrealistic 100%.",
          },
          {
            type: "p",
            text: "This surfaced a bug early on: Spotify's GraphQL data sometimes returns duplicate track URIs for the same song, which let albums \"complete\" after only partial listens. I fixed it by deduping by URI everywhere completion is calculated, and added a one-time repair pass to recheck and demote any discs that had been awarded incorrectly.",
          },
          {
            type: "p",
            text: "**When does an album count as \"in progress\"?** I didn't want the in-progress shelf cluttered by every album someone plays one song from. I considered a percentage threshold, but that penalizes longer albums unfairly — 10% of a 20-track album is a real commitment, 10% of a 4-track EP is one song. I went with a fixed count instead: 3 tracks listened, capped at the album's length for shorter releases. It's a simpler rule, and it means the bar for \"in progress\" is the same effort regardless of album length.",
          },
          {
            type: "p",
            text: "**Designing the badge itself.** The badge is a real CD — album art composited into the label — with progress shown as a clockwise wipe of color over grayscale, like a clock hand. I made a specific call here: the wipe stalls just before 100% and only fully closes on true completion. Without that, a nearly-finished album would visually read as \"done,\" which undercuts the whole point of the badge. There's also no separate loading state; the grayscale disc doubles as the \"not started\" placeholder, so the same object represents every stage instead of swapping components in and out.",
          },
          {
            type: "image",
            caption: "Badge progress states — not started, in progress, complete",
          },
          {
            type: "p",
            text: "**Getting the data without breaking Spotify.** I originally pulled album/track data from the public Spotify Web API, but hit rate limits fast. I switched to the same internal GraphQL gateway Spotify's own client uses for tracklists — same data, no limit, but undocumented and unstable by nature. To hedge against that, I scan responses generically for keys containing \"artist\" or \"cover\" rather than hardcoding a specific nested path, so a schema change doesn't silently break the extension. I also dedupe in-flight requests per album and add backoff after failed fetches, and fall back to the player's local data to backfill artist names on older completed albums when the gateway comes up short.",
          },
        ],
      },
      {
        id: "ui-ux",
        label: "UI/UX Details",
        content: [
          {
            type: "list",
            items: [
              "**Album page:** a mini disc sits beside the play button. Hovering spins it and shows a toast with percent listened; clicking opens a breakdown of which tracks have been heard and which haven't.",
              "**Profile page:** two new sections — one near the follower count, one beneath Public Playlists — reusing Spotify's existing grid/\"Show more\" layout so they read as native, not bolted-on. A caption reads \"X collected · X in progress\" over one shared shelf.",
              "**\"Show all\" page:** a dedicated view with filter pills to toggle between in-progress and complete discs. Built as a fake sub-route so native back/forward still works, matching the rest of the app's navigation.",
              "Badge visibility is scoped to the album's own detail view — it doesn't appear in library lists or search, keeping the signal tied to the moment of listening rather than everywhere the album shows up.",
            ],
          },
          {
            type: "image",
            caption: "Album page — mini disc badge next to the play button",
          },
          {
            type: "image",
            caption: "Profile page — collected and in-progress badge shelves",
          },
        ],
      },
      {
        id: "challenges",
        label: "Challenges",
        content: [
          {
            type: "p",
            text: "**Rate limits.** The public Spotify API wasn't built for the frequency of polling this extension needs, so I moved to Spotify's own internal gateway — trading documentation for reliability.",
          },
          {
            type: "p",
            text: "**A UI I don't own.** Spotify's CSS classnames are hashed and change without warning; one already broke an earlier version of the badge. Instead of hardcoding those classnames on the profile page, I clone Spotify's actual native DOM structure and reuse it, so updates on their end are less likely to snap the extension. The filter pills, which have no native equivalent to clone, are hand-built instead. Because the DOM can re-render at any time, a permanent watcher re-injects the album badge whenever it goes missing, rather than relying on a bounded retry that could give up too early. The hover-spin on profile cards also had to move from CSS `:hover` to JS, since each card's click overlay was intercepting the hover before it reached the icon.",
          },
        ],
      },
      {
        id: "outcome",
        label: "Outcome & Next Steps",
        content: [
          {
            type: "p",
            text: "Currently shipped: completion tracking, album-page badge with hover/click detail, and profile page badge shelves with filtering. Considering next: tightening the in-progress threshold to a percentage-based rule instead of a fixed count, and exploring a Spotify Wrapped–style integration to surface yearly listening completions.",
          },
          {
            type: "quote",
            text: "Reflection: the most interesting design constraint on this project wasn't the interaction design, it was designing for a surface I don't control — building something that has to survive changes I can't predict or prevent.",
          },
        ],
      },
    ],
  },
  {
    slug: "project-two",
    title: "Project Two",
    badge: "Placeholder Badge",
    tags: ["Tag One", "Tag Two"],
    gradient: "from-sky-400 via-blue-300 to-indigo-200",
    meta: placeholderMeta(["Tag One", "Tag Two"]),
    sections: defaultSections,
  },
  {
    slug: "project-three",
    title: "Project Three",
    badge: "Placeholder Badge",
    tags: ["Tag One", "Tag Two", "Tag Three"],
    gradient: "from-emerald-400 via-teal-300 to-cyan-200",
    meta: placeholderMeta(["Tag One", "Tag Two", "Tag Three"]),
    sections: defaultSections,
  },
  {
    slug: "project-four",
    title: "Project Four",
    badge: "Placeholder Badge",
    tags: ["Tag One", "Tag Two"],
    gradient: "from-fuchsia-400 via-pink-300 to-rose-200",
    meta: placeholderMeta(["Tag One", "Tag Two"]),
    sections: defaultSections,
  },
];
