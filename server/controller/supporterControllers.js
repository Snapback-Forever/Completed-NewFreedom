import db from "../db/index.js";

const supporterController = {

  addSupporter: async (req, res) => {
    const {
      // Display / identity
      name,
      logoUrl,
      logoFileId,
      logoBucketName,
      shortDescription,
      // Contact info
      address,
      phoneNumber,
      email,
      contactName,
      websiteLink,
      // Extra links
      social,
      // Tier
      tier,
    } = req.body;
    try {
      const newSupporter = new db.Support({
        name,
        logoUrl,
        logoFileId,
        logoBucketName,
        shortDescription,
        address,
        phoneNumber,
        email,
        contactName,
        websiteLink,
        social,
        tier,
      });
      const savedSupporter = await newSupporter.save();
      return res.status(201).json({
        supporter: savedSupporter,
        message: "Supporter created successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: "Error creating supporter." });
    }
  },

  updateSupporter: async (req, res) => {
    const { supporterId } = req.params;
    const {
      name,
      logoUrl,
      logoFileId,
      logoBucketName,
      shortDescription,
      address,
      phoneNumber,
      email,
      contactName,
      websiteLink,
      social,
      tier,
    } = req.body;
    try {
      const updatedSupporter = await db.Support.findByIdAndUpdate(
        supporterId,
        {
          name,
          logoUrl,
          logoFileId,
          logoBucketName,
          shortDescription,
          address,
          phoneNumber,
          email,
          contactName,
          websiteLink,
          social,
          tier,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedSupporter) {
        return res.status(404).json({ message: "Supporter not found." });
      }
      return res.status(200).json({
        supporter: updatedSupporter,
        message: "Supporter updated successfully!",
      });
    } catch (err) {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({
        message: "Error updating supporter.",
      });
    }
  },

      deleteSupporter: async (req, res) => {
        const {supporterId} = req.params;
        try {
          const deletedSupporter = await db.Support.findByIdAndDelete(supporterId);
          if (!deletedSupporter) {
            return res.status(404).json({ message: "Supporter not found." });
          }
          return res.status(200).json({
            ...deletedSupporter.toObject(),
            message: "Supporter deleted successfully!",
          });
        } catch (err) {
          console.error(err);
          // CastError typically means invalid ObjectId format
          if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid supporter ID." });
          }
          return res.status(500).json({ message: "Error deleting supporter." });
        }
      }, 

      addAddress: async (req, res) => {
        const supporterId = req.params.id;
        const {
          street,
          city,
          state,
          zip,
          country,
        } = req.body;
        try {
          const updatedSupporter = await db.Support.findByIdAndUpdate(
            supporterId,
            {
              $addToSet: {
                address: {
                  street,
                  city,
                  state,
                  zip,
                  country,
                },
              },
            },
            {
              new: true,
              runValidators: true,
            }
          );
          if (!updatedSupporter) {
            return res.status(404).json({ message: "Supporter not found." });
          }
          return res.status(200).json({
            ...updatedSupporter.toObject(),
            message: "Address added successfully!",
          });
        } catch (err) {
          console.error(err);
          if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
          }
          if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid supporter ID." });
          }
          return res.status(500).json({ message: "Error adding address." });
        }
      },

      addSocial: async (req, res) => {
        const supporterId = req.params.supporterId;
        const {
          socialName,
          socialLink,
          socialLogo,
          socialTitle,
          socialFileId,
          socialBucketName
        } = req.body;
        if (!socialName || !socialLink) {
          return res.status(400).json({
            message: "Both socialName and socialLink are required."
          });
        }
        try {
          const updatedSupporter = await db.Support.findByIdAndUpdate(
            supporterId,
            {
              $addToSet: {
                social: {
                  socialName,
                  socialLink,
                  socialLogo,
                  socialTitle,
                  socialFileId,
                  socialBucketName
                }
              }
            },
            {
              new: true,
              runValidators: true
            }
          );
          if (!updatedSupporter) {
            return res.status(404).json({ message: "Supporter not found." });
          }
          return res.status(200).json({
            supporter: updatedSupporter,
            message: "Social link added successfully!"
          });
        } catch (err) {
          console.error(err);
          if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
          }
          if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid supporter ID." });
          }
          return res.status(500).json({
            message: "Error adding social link."
          });
        }
      },

      deleteSocial: async (req, res) => {
        const { supporterId, socialId } = req.params;
        try {
          const updatedSupporter = await db.Support.findByIdAndUpdate(
            supporterId,
            {
              $pull: {
                social: { _id: socialId }
              }
            },
            { new: true }
          );
          if (!updatedSupporter) {
            return res.status(404).json({ message: "Supporter not found." });
          }
          return res.status(200).json({
            supporter: updatedSupporter,
            message: "Social link deleted successfully!"
          });
        } catch (err) {
          console.error(err);
          if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid ID." });
          }
          return res.status(500).json({
            message: "Error deleting social link."
          });
        }
      },

      updateSocial: async (req, res) => {
        const supporterId = req.params.supporterId;
        const {
          socialId,
          socialName,
          socialLink,
          socialLogo,
          socialTitle,
          socialFileId,
          socialBucketName
        } = req.body;
        if (!socialId) {
          return res.status(400).json({ message: "socialId is required." });
        }
        try {
          const updatedSupporter = await db.Support.findOneAndUpdate(
            {
              _id: supporterId,
              "social._id": socialId
            },
            {
              $set: {
                "social.$.socialName": socialName,
                "social.$.socialLink": socialLink,
                "social.$.socialLogo": socialLogo,
                "social.$.socialTitle": socialTitle,
                "social.$.socialFileId": socialFileId,
                "social.$.socialBucketName": socialBucketName
              }
            },
            {
              new: true,
              runValidators: true
            }
          );
          if (!updatedSupporter) {
            return res.status(404).json({
              message: "Supporter or social entry not found."
            });
          }
          return res.status(200).json({
            supporter: updatedSupporter,
            message: "Social link updated successfully!"
          });
        } catch (err) {
          console.error(err);
          if (err.name === "ValidationError") {
            return res.status(400).json({ message: err.message });
          }
          if (err.name === "CastError") {
            return res.status(400).json({
              message: "Invalid supporter or social ID."
            });
          }
          return res.status(500).json({
            message: "Error updating social link."
          });
        }
      },

      updateSupporterTier: async (req, res) => {
        const supporterId = req.params.id;
        const { tier } = req.body;
        // Ensure tier is provided
        if (!tier) {
          return res.status(400).json({ message: "Tier is required." });
        }
        try {
          const updatedSupporter = await db.Support.findByIdAndUpdate(
            supporterId,
            { tier }, // only update the tier field
            {
              new: true,           // return the updated document
              runValidators: true, // enforce enum validation from the schema
            }
          );
          if (!updatedSupporter) {
            return res.status(404).json({ message: "Supporter not found." });
          }
          return res.status(200).json({
            ...updatedSupporter.toObject(),
            message: "Supporter tier updated successfully!",
          });
        } catch (err) {
          console.error(err);
          if (err.name === "ValidationError") {
            // e.g. tier not in ["platinum", "gold", "silver", "bronze", "supporter"]
            return res.status(400).json({ message: err.message });
          }
          if (err.name === "CastError") {
            return res.status(400).json({ message: "Invalid supporter ID." });
          }
          return res.status(500).json({ message: "Error updating supporter tier." });
        }
      },

      getAllSupporters: async (req, res) => {
        try {
          const page  = parseInt(req.query.page, 10)  || 1;
          const limit = parseInt(req.query.limit, 10) || 20;
          const skip  = (page - 1) * limit;
          const [supporters, total] = await Promise.all([
            db.Support
              .find()
              .sort({ createdAt: -1 })
              .skip(skip)
              .limit(limit),
            db.Support.countDocuments(),
          ]);
          return res.status(200).json({
            data: supporters,
            total,
            page,
            pages: Math.ceil(total / limit),
          });
        } catch (err) {
          console.error(err);
          return res
            .status(500)
            .json({ message: "Error fetching supporters." });
        }
      },

}

export default supporterController