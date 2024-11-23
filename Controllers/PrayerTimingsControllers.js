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


exports.uploadprayertimings = async (req, res) => {
  try {
    const email = req.email; // Get user email
    const datas = req.body; // Get input data

    console.log('Received Data:', JSON.stringify(datas, null, 2)); // Log received data

    // Find or create the user's prayer timings record
    let prayerTiming = await PrayerTiming.findOne({ email });

    if (!prayerTiming) {
      // Create a new record if not found
      prayerTiming = new PrayerTiming({ email, years: [] });
    }

    // Process each month in the input data
    for (const month of Object.keys(datas)) {
      const [monthName, year] = month.split(' ');
      const timingsData = datas[month];

      if (!timingsData || !Array.isArray(timingsData)) {
        console.warn(`Invalid data for month ${month}`);
        continue;
      }

      // Map the timings for each date
      const parsedTimings = timingsData.map((entry) => {
        const timings = entry.timings || {};
        return {
          date: entry.date,
          timings: {
            fajr: timings.Fajr || "Not Set",
            dhuhr: timings.Dhuhr || "Not Set",
            asr: timings.Asr || "Not Set",
            maghrib: timings.Maghrib || "Not Set",
            isha: timings.Isha || "Not Set",
          },
        };
      });

      // console.log('Parsed Timings for Month:', monthName, JSON.stringify(parsedTimings, null, 2));

      // Ensure the year exists
      let yearEntry = prayerTiming.years.find((y) => y.year === parseInt(year));

      if (!yearEntry) {
        yearEntry = { year: parseInt(year), months: [] };
        prayerTiming.years.push(yearEntry);
      }

      // Ensure the month exists
      let monthEntry = yearEntry.months.find((m) => m.name === monthName);

      if (!monthEntry) {
        monthEntry = { name: monthName, timings: [] };
        yearEntry.months.push(monthEntry);
      }

      // Update timings for the month
      parsedTimings.forEach((newTiming) => {
        const existingDate = monthEntry.timings.find((t) => t.date === newTiming.date);

        if (existingDate) {
          existingDate.timings = newTiming.timings; // Update timings if date exists
        } else {
          monthEntry.timings.push(newTiming); // Add new date and timings
        }
      });
    }

    // console.log('Prayer Timing Document Before Save:', JSON.stringify(prayerTiming, null, 2));

    // Save to the database
    await prayerTiming.save();

    res.status(201).json({ message: 'Prayer timings saved successfully!' });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ message: 'An error occurred while saving prayer timings.' });
  }
};


exports.getsalahtimings = async (req, res) => {
  try {
    console.log("entered into salah");
    const email = req.email;

    const today = new Date();

    // Convert today's date to DD-MM-YYYY format
    const todayDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

    const currentMonth = today.toLocaleString('default', { month: 'long' }); // e.g., "November"
    const currentYear = today.getFullYear();

    // Fetch the user record by email
    const prayerTiming = await PrayerTiming.findOne({ email });

    if (!prayerTiming) {
      console.log("Entered into not prayertimings");
      return res.status(404).json({ message: 'No prayer timings found for this user.' });
    }

    // Find the correct year
    const yearData = prayerTiming.years.find((year) => year.year === currentYear);
    if (!yearData) {
      console.log("Entered into not yearData");
      return res.status(404).json({ message: `No prayer timings found for the year ${currentYear}.` });
    }

    // Find the correct month
    const monthData = yearData.months.find((month) => month.name === currentMonth);
    if (!monthData) {
      console.log("Entered into not month data");
      return res.status(404).json({ message: `No prayer timings found for the month ${currentMonth}.` });
    }

    // Find today's timings
    const todayTiming = monthData.timings.find((day) => day.date === todayDate);
    if (!todayTiming) {
      console.log("Not today's timings");
      return res.status(404).json({ message: `No prayer timings found for today's date (${todayDate}).` });
    }
    // Return the prayer timings for today
    res.status(200).json({
      date: todayDate,
      timings: todayTiming.timings,
    });
    
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'An error occurred while fetching prayer timings.' });
  }
};



