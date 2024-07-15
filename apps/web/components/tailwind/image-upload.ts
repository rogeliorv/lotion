import { createImageUpload, createGeneratedImageFunction } from "lotion/plugins";
import { toast } from "sonner";

const onUpload = (file: File) => {
  const promise = fetch("/api/upload", {
    method: "POST",
    headers: {
      "content-type": file?.type || "application/octet-stream",
      "x-vercel-filename": file?.name || "image.png",
    },
    body: file,
  });

  return new Promise((resolve, reject) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { url } = (await res.json()) as { url: string };
          // preload the image
          const image = new Image();
          image.src = url;
          image.onload = () => {
            resolve(url);
          };
          // No blob store configured
        } else if (res.status === 401) {
          resolve(file);
          throw new Error("`BLOB_READ_WRITE_TOKEN` environment variable not found, reading image locally instead.");
          // Unknown error
        } else {
          throw new Error("Error uploading image. Please try again.");
        }
      }),
      {
        loading: "Uploading image...",
        success: "Image uploaded successfully.",
        error: (e) => {
          reject(e);
          return e.message;
        },
      },
    );
  });
};


const fetchGeneratedImage = (imgPrompt: string, apiKey: string) => {
  const promise = fetch("/api/generateImage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-magic-header": 'magic_secret',
    },
    body: JSON.stringify({ prompt: imgPrompt, apiKey }),
  });

  return new Promise((resolve, reject) => {
    toast.promise(
      promise.then(async (res) => {
        // TODO: Manage success of the image geneartion
        if (res.status === 200) {
          const { url } = (await res.json()) as { url: string };
          // preload the image
          const image = new Image();
          image.src = url;
          image.onload = () => {
            resolve(url);
          };
          // No blob store configured
        } else if (res.status === 401) {
          throw new Error("401 - Unauthorized");
        }
        else if (res.status === 410) {
          throw new Error("This API has been deprecated by its author");
        }
        else if (res.status === 400) {
          throw new Error("Bad Request. Did you configure your API key?");
        } else {
          throw new Error("Error generating image. Please try again.");
        }
      }),
      {
        loading: "Generating image...",
        success: "Image generated successfully.",
        error: (e) => {
          reject(e);
          return e.message;
        },
      },
    );
  });
};


export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("image/")) {
      toast.error("File type not supported.");
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});

export const insertGeneratedImage = createGeneratedImageFunction({
  fetchGeneratedImage,
});
