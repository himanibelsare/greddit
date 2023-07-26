import mongoose from "mongoose";

const ReportsSchema = new mongoose.Schema({
  Post: String,
  ReportedBy: String,
  Reason: String,
  personReported: String,
  subName: String,
});

const Report = mongoose.model("reports", ReportsSchema);

export default Report;
