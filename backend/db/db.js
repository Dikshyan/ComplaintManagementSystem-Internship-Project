const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const seedDB = async () => {
  const { userModel } = require("../models/user.model");
  const { complaintModel } = require("../models/complaint.model");

  try {
    const userCount = await userModel.countDocuments();
    if (userCount === 0) {
      console.log("Seeding default users...");
      const hashedPassword = await bcrypt.hash("password123", 10);
      
      const adminUser = await userModel.create({
        name: "Aarav Mehta",
        email: "aarav.mehta@community.in",
        password: hashedPassword,
        role: "admin"
      });

      const staffUser = await userModel.create({
        name: "Sneha Rao",
        email: "sneha.rao@community.in",
        password: hashedPassword,
        role: "staff"
      });

      const user1 = await userModel.create({
        name: "Rajesh Kumar",
        email: "rajesh.k@community.in",
        password: hashedPassword,
        role: "user"
      });

      const user2 = await userModel.create({
        name: "Vikram Shah",
        email: "vikram.shah@community.in",
        password: hashedPassword,
        role: "user"
      });

      console.log("Seeding default complaints...");
      await complaintModel.create([
        {
          userId: user1._id,
          title: "Streetlights broken for three weeks in Indiranagar Sector 4",
          description: "All streetlights along 12th Main Road in Indiranagar are non-functional, creating a serious hazard for commuters and pedestrians at night. Safety concern for women and elderly residents. We have reported this to BBMP municipal office twice but no action has been taken yet.",
          category: "Electricity",
          location: "Indiranagar, Bangalore",
          priority: "High",
          status: "OPEN",
          voteCount: 245
        },
        {
          userId: user2._id,
          title: "Massive pothole near Silk Board flyover causing gridlock",
          description: "A huge pothole has formed right at the entry ramp of the Silk Board flyover heading towards HSR Layout. It is forcing vehicles to brake suddenly, creating a chain reaction of traffic jams stretching back 2 kilometers. Needs urgent hot-mix asphalt filling.",
          category: "Roads & Traffic",
          location: "Silk Board, Bangalore",
          priority: "High",
          status: "IN_PROGRESS",
          voteCount: 389
        },
        {
          userId: user1._id,
          title: "Garbage collection missed for 5 days in Koramangala 3rd Block",
          description: "The municipal garbage truck has not visited 8th Cross in Koramangala 3rd block for the last five days. Large piles of wet waste have accumulated outside houses, producing a strong foul smell and attracting stray animals. Health hazard for children living nearby.",
          category: "Sanitation",
          location: "Koramangala, Bangalore",
          priority: "Medium",
          status: "OPEN",
          voteCount: 128
        },
        {
          userId: user2._id,
          title: "Municipal drinking water supply pipe leak on Sector 7 main road",
          description: "Fresh water is gushing out of a cracked joint on the main supply pipe near Sector 7 park. Thousands of liters of clean drinking water are being wasted daily while water pressure in neighboring households has dropped to almost zero.",
          category: "Water Supply",
          location: "HSR Layout, Bangalore",
          priority: "High",
          status: "RESOLVED",
          voteCount: 198
        },
        {
          userId: user1._id,
          title: "Stray dog menace near primary school playground",
          description: "A pack of 8-10 aggressive stray dogs has taken shelter inside the municipal park next to St. Mary's School. Children are terrified to use the playground, and there have been reports of dogs chasing cyclists and school buses. Requesting animal welfare team intervention for vaccination and sterilisation.",
          category: "Public Safety",
          location: "Jayanagar, Bangalore",
          priority: "Low",
          status: "OPEN",
          voteCount: 94
        }
      ]);
      console.log("Database seeded successfully.");
    }
  } catch (err) {
    console.error("Failed to seed database:", err);
  }
};

const connectDB = async () => {
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        await seedDB();
    }catch(error){
        console.log(`Database Connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = {
    connectDB
}