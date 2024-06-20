<a href="https://lotion.vercel.app">
  <h1 align="center">Lotion is a Notion + AI project for Encode bootcamp. It is based on the Novel project.</h1>
</a>

<p align="center">
  It features autocompletion, images, drawings and more
</p>


<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#setting-up-locally"><strong>Setting Up Locally</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> ·
  <a href="#license"><strong>License</strong></a>
</p>
<br/>


## Introduction

[Lotion](https://lotion.vercel.app/) is a Notion + AI project for Encode bootcamp. It is based on the Novel project.


<br />

## Setting Up Locally

To set up Lotion locally, you'll need to clone the repository and set up the following environment variables:

- `OPENAI_API_KEY` – your OpenAI API key (you can get one [here](https://platform.openai.com/account/api-keys))
- `BLOB_READ_WRITE_TOKEN` – your Vercel Blob read/write token (currently [still in beta](https://vercel.com/docs/storage/vercel-blob/quickstart#quickstart), but feel free to [sign up on this form](https://vercel.fyi/blob-beta) for access)

To run the app locally, you can run the following commands:

```
pnpm i
pnpm dev
```

## Tech Stack

Lotion is built on the following stack:

- [Next.js](https://nextjs.org/) – framework
- [Tiptap](https://tiptap.dev/) – text editor
- [Novel](https://novel.sh/) – novel, a notion lookalike library
- [OpenAI](https://openai.com/) - AI completions
- [Vercel AI SDK](https://sdk.vercel.ai/docs) – AI library
- [Vercel](https://vercel.com) – deployments
- [TailwindCSS](https://tailwindcss.com/) – styles
- [Cal Sans](https://github.com/calcom/font) – font

## License

Licensed under the Apache-2.0 license