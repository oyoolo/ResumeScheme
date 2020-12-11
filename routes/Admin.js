import express from "express";
import SystemController from "../controllers/SystemController.js";
const router = express.Router();

//Admin Homepage
router.get("/", async (req, res) => {
  res.render("adminpanel", { title: "TEST THIS" });
});

//Update Job Suggestions
router.get("/query_suggestions", async (req, res) => {
  try {
    await new SystemController().suggestJobs();
    req.flash("success_msg", "New Suggestions Generated!");
    res.render("adminpanel", { message: "New Suggestions Generated!" });
  } catch (error) {
    req.flash("error_msg", error.stack);
  }

  // res.redirect("/")
});

export default router;
