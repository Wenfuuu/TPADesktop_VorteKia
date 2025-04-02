import { useDropzone } from "react-dropzone";

type ImageUploadProps = {
  image: Uint8Array | null;
  onImageUpload: (binaryImage: Uint8Array) => void;
};

export default function ImageUpload({ image, onImageUpload }: ImageUploadProps) {
    const imageUrl = image
      ? URL.createObjectURL(
          new Blob([new Uint8Array(image)], { type: "image/png" })
        )
      : "";
    // console.log(imageUrl)

    const onDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = () => {
            const arrayBuffer = reader.result as ArrayBuffer;
            const binaryImage = new Uint8Array(arrayBuffer);

            onImageUpload(binaryImage);
        };

        reader.readAsArrayBuffer(file);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        multiple: false,
    });

  return (
    <div
      {...getRootProps()}
      className={`flex items-center w-64 h-40 border-2 border-dashed p-6 rounded-md text-center cursor-pointer ${
        isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300"
      }`}
    >
      <input {...getInputProps()} />
      {image ? (
        <img src={imageUrl} alt="Uploaded" className="mx-auto max-h-40" />
      ) : (
        <p>Drag & drop an image here, or click to select one</p>
      )}
    </div>
  );
}
