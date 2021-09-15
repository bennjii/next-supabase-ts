### Create a Next app with Supabase

Easily create next apps with javascript or typescript (build in). This CLI allows you to create a new next app and by default installs supabase. It also can initialise a git repository within. Uses *create-next-app* to create the next project. There is only one default template - the next default prebuild, but can use either typescript or javascript by choice, defaults to **typescript**.

Default usage 
```
npx create-next-supabase
```

The prompts will query you on the following parameters
- **Prefered Language** (Typescript / Javascript)
- **Git** (Initialise or Not)
- **Project Name** (For NextJS project & folder name)

##### Arguments
The possible arguments that can be passed into the command to skip interactable prompts, for usage in automated systems or manual prefrence. Example Usage: `npx create-next-supabase --yes`

To skip using different interactive options the following arguments can be passed:

| Argument | Description          |
|-------|--------------------------------------------|
| --git | Enable git by default (don't ask)          |
| --yes | No interactive options, use defaults only. |