// controllers/IqamaController.js
const { ObjectId } = require('mongodb');
const Iqama = require('../Models/Iqama');
const mongoose = require('mongoose');

exports.addIqama = async (req, res) => {
  try {
    const email  = req.email;
    const { date, filteredTimes } = req.body;
    console.log(date,filteredTimes);
    // Create new Iqama entry with provided data
    const newIqama = new Iqama({
      email,
      date,
      times: filteredTimes,
    });
    
    // Save the entry to the database
    await newIqama.save();
    res.status(201).json({ message: 'Iqama timings added successfully', iqama: newIqama });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding Iqama timings', error });
  }
};

exports.alliqmas = async (req,res)=>{
    try {
        const email = req.email;
        const datas = await Iqama.find({email:email});
        res.status(200).json(datas);
    } catch (error) {
        console.log(error.message);
    }
}

exports.getcurrentiqaman = async(req,res)=>{
  try {
    const today = new Date(); // Get today's date

    // Query the database to find the most recent record greater than or equal to today
    const iqmah = await Iqama.find({ date: { $lte: today } })
      .sort({ date: -1 }) // Sort in ascending order of date
      .limit(1); // Get the closest record
    res.status(200).json(iqmah);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch recent Iqamah timing.' });
  }

}



exports.updateiqama = async (req, res) => {
  try {
    const email = req.email; // Email from authenticated user
    const { date, filteredTimes } = req.body;

    if (!email || !date || !filteredTimes) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Format the date to match the database format
    const formattedDate = new Date(date).toISOString().split("T")[0];

    // Find the Iqama document by email and date
    const existingIqama = await Iqama.findOne({ email, date: formattedDate });

    if (existingIqama) {
      // Update the times in the existing document
      existingIqama.times = filteredTimes;
      await existingIqama.save();
      return res
        .status(200)
        .json({ message: "Iqama updated successfully.", iqama: existingIqama });
    }

    // If no document exists, create a new one
    const newIqama = await Iqama.create({
      email,
      date: formattedDate,
      times: filteredTimes,
    });

    return res
      .status(201)
      .json({ message: "Iqama created successfully.", iqama: newIqama });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error." });
  }
};
exports.deleteiqama = async (req, res) => {
  try {
    const email = req.email;
    const id = req.body.id.id; // Access the 'id' directly from req.body

    if (!id) {
      return res.status(400).json({ message: "ID is required." });
    }

    // Check if the ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }

    console.log('this is for deleteiqama');
    console.log(id);  // Log to check the id

    // Find the Iqama document and delete it
    const deletedIqama = await Iqama.findByIdAndDelete(id);

    // Check if the document was found and deleted
    if (!deletedIqama) {
      return res.status(404).json({ message: "Iqama not found." });
    }

    return res.status(200).json({ message: "Iqama deleted successfully." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};


