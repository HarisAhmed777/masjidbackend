const PrayerTiming = require('../Models/PrayerTimings'); // Adjust the import based on your file structure

// Check if prayer timings exist for the user
exports.showTodayTimings = async (req, res) => {
  const { email, today } = req.body; // 'today' should be in 'DD-MM-YYYY' format
console.log(email,today,"jaa");
    console.log("entered show today timings");
  try {
    // Find prayer timings in the database for the specified email and today's date
    const prayerTiming = await PrayerTiming.findOne({ email, date: today });

    if (prayerTiming) {
      res.json({ timings: prayerTiming.timings });
    } else {
      res.status(404).json({ message: 'Prayer timings not found for today.' });
    }
  } catch (error) {
    console.error('Error fetching today\'s prayer timings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Save adjusted prayer timings for the user
exports.savePrayerTimings = async (req, res) => {
  const { email, adjustedTimings } = req.body;

  try {
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

    // Check if a record exists for today
    const existingTiming = await PrayerTiming.findOne({ email, date: today });

    if (existingTiming) {
      // Update the existing record with the adjusted timings
      existingTiming.timings = adjustedTimings.map(timing => timing.timings);
      await existingTiming.save();
      return res.status(200).json({ message: 'Prayer timings updated successfully' });
    } else {
      // Create a new record if it doesn't exist
      const newTiming = new PrayerTiming({
        email,
        date: today,
        timings: adjustedTimings.map(timing => timing.timings),
      });
      await newTiming.save();
      return res.status(201).json({ message: 'Prayer timings saved successfully' });
    }
  } catch (error) {
    console.error('Error saving prayer timings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to check if prayer timings exist for the user
exports.checkPrayerTimings = async (req, res) => {
  const { email } = req.body;

  try {
    // Find prayer timings in the database for the specified email
    const prayerTiming = await PrayerTiming.findOne({ email });

    if (prayerTiming) {
      res.status(200).json({ exists: true, date: prayerTiming.date }); // Optionally return the date
    } else {
      res.status(404).json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking prayer timings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

