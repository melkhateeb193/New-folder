import cloudinary from "./cloudinary.js";

export const uploadFileCloudinary = async ({
  source,
  name,
  email,
  nameOfFolder,
  resource_type = "auto",
  overwrite = false,
}) => {
  try {
    if (!source || !name || !email || !nameOfFolder) {
      throw new Error("Missing required parameters");
    }

    const folderPath = `${name}-${email}/${nameOfFolder}`;
    const options = {
      folder: folderPath,
      use_filename: true,
      resource_type,
      invalidate: true,
    };

    if (overwrite) {
      await cloudinary.api.delete_resources_by_prefix(folderPath);
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(
      source,
      options
    );
    return { secure_url, public_id };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.message);
    return { error: error.message };
  }
};

/********************************************************************************/

export const deleteOneFileCloudinary = async ({ publicId }) => {
  try {
    if (!publicId) {
      return false;
    }
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary:", error.message);
    return false;
  }
};

/********************************************************************************/

export const deleteManyFileCloudinary = async ({ publicIds }) => {
  try {
    if (!Array.isArray(publicIds) || publicIds.length === 0) {
      throw new Error("Invalid input: publicIds must be a non-empty array");
    }

    const deletePromises = publicIds.map(async (publicId) => {
      const result = await cloudinary.uploader.destroy(publicId);
      return { publicId, success: result.result === "ok" };
    });

    const results = await Promise.all(deletePromises);

    const deletedFiles = results
      .filter((res) => res.success)
      .map((res) => res.publicId);
    const failedFiles = results
      .filter((res) => !res.success)
      .map((res) => res.publicId);

    return {
      success: failedFiles.length === 0,
      deletedFiles,
      failedFiles,
      message:
        failedFiles.length === 0
          ? "All files deleted successfully"
          : "Some files could not be deleted",
    };
  } catch (error) {
    console.error("Error deleting files from Cloudinary:", error.message);
    return { success: false, error: error.message };
  }
};

/********************************************************************************/

export const deleteFolderCloudinary = async ({ folderPath }) => {
  try {
    if (!folderPath) {
      throw new Error("Missing required parameter: folderPath");
    }
    const { deleted } = await cloudinary.api.delete_resources_by_prefix(
      folderPath
    );

    await cloudinary.api.delete_folder(folderPath);

    return {
      success: true,
      message: "Folder and its contents deleted successfully",
      deletedFiles: Object.keys(deleted),
    };
  } catch (error) {
    console.error("Error deleting folder from Cloudinary:", error.message);
    return { success: false, error: error.message };
  }
};

/*********************************************************************** */
export const uploadMultipleFileCloudinary = async ({
  source,
  name,
  email,
  nameOfFolder,
  resource_type,
}) => {
  let arr = [];
  for (const file of source) {
    let { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${name}-${email}/${nameOfFolder}`,
        use_filename: true,
        resource_type,
      }
    );
    arr.push({ secure_url, public_id });
  }
  return arr;
};

/*

 middleWares.multerCloud(middleWares.fileFormat.image).fields([
    { name: "profilePic", maxCount: 1 },
    { name: "coverPic", maxCount: 1 },
  ]),


*/
