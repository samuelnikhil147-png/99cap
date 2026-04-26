
const fs = require('fs');

const roomTypes = ["Standard Capsule", "Premium Capsule", "Female Only Capsule", "Private Room"];
const statuses = ["Available", "Booked", "Occupied", "Cleaning", "Maintenance", "Reserved", "Blocked"];
const indianNames = [
  "Rahul Kumar", "Anita Reddy", "Suresh Patel", "Priya Sharma", "Arjun Naidu",
  "Sandeep Singh", "Megha Gupta", "Vikram Rathore", "Deepa Nair", "Rohan Joshi",
  "Anjali Desai", "Karan Malhotra", "Sneha Iyer", "Manish Verma", "Pooja Hegde",
  "Abhishek Rao", "Kavita Bisht", "Nitin Gadkari", "Shweta Tiwari", "Aditya Birla",
  "Sunita Williams", "Rajesh Khanna", "Amitabh Bachchan", "Shah Rukh Khan", "Salman Khan",
  "Aamir Khan", "Deepika Padukone", "Priyanka Chopra", "Ranbir Kapoor", "Alia Bhatt",
  "Varun Dhawan", "Shraddha Kapoor", "Sidharth Malhotra", "Kiara Advani", "Kartik Aaryan",
  "Sara Ali Khan", "Janhvi Kapoor", "Ishaan Khatter", "Ananya Panday", "Tiger Shroff",
  "Disha Patani", "Vicky Kaushal", "Katrina Kaif", "Ayushmann Khurrana", "Rajkummar Rao",
  "Pankaj Tripathi", "Nawazuddin Siddiqui", "Manoj Bajpayee", "Radhika Apte", "Taapsee Pannu"
];

const generateData = () => {
  const rooms = [];
  const statusDistribution = {
    "Available": 70,
    "Occupied": 40,
    "Booked": 30,
    "Cleaning": 20,
    "Maintenance": 20,
    "Reserved": 10,
    "Blocked": 10
  };

  let roomCounter = 1;
  Object.keys(statusDistribution).forEach(status => {
    for (let i = 0; i < statusDistribution[status]; i++) {
      const type = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      rooms.push({
        roomId: `RM-${String(roomCounter).padStart(3, '0')}`,
        roomNumber: String(roomCounter),
        roomType: type,
        floorNumber: Math.ceil(roomCounter / 50),
        rate: type === "Private Room" ? 800 : (type === "Premium Capsule" ? 500 : 350),
        status: status,
        capacity: type === "Private Room" ? 2 : 1,
        isActive: true,
        lastCleanedAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
      });
      roomCounter++;
    }
  });

  const customers = [];
  for (let i = 1; i <= 150; i++) {
    const name = indianNames[Math.floor(Math.random() * indianNames.length)] + " " + (i % 10);
    customers.push({
      customerId: `CUST-${String(i).padStart(3, '0')}`,
      name: name,
      phoneNumber: `${Math.floor(7000000000 + Math.random() * 2999999999)}`,
      email: `${name.toLowerCase().replace(/ /g, '.')}@email.com`,
      gender: i % 2 === 0 ? "Male" : "Female",
      idProofType: ["Aadhaar", "PAN", "Voter ID", "Passport"][Math.floor(Math.random() * 4)],
      idNumber: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 8999)}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 86400000).toISOString()
    });
  }

  const bookings = [];
  const occupiedRooms = rooms.filter(r => r.status === "Occupied" || r.status === "Booked");
  for (let i = 1; i <= 120; i++) {
    const room = occupiedRooms[i % occupiedRooms.length];
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const checkIn = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);
    const checkOut = new Date(checkIn.getTime() + (Math.floor(Math.random() * 24) + 1) * 60 * 60 * 1000);
    
    bookings.push({
      bookingId: `BK-${String(i).padStart(3, '0')}`,
      roomId: room.roomId,
      customerId: customer.customerId,
      checkInTime: checkIn.toISOString(),
      checkOutTime: checkOut.toISOString(),
      durationHours: Math.floor((checkOut - checkIn) / (1000 * 60 * 60)),
      status: i === 1 ? "Overstay" : (i % 5 === 0 ? "Checked-Out" : "Checked-In"),
      totalAmount: room.rate,
      paymentStatus: i % 7 === 0 ? "Pending" : "Paid",
      createdAt: new Date(checkIn.getTime() - 3600000).toISOString()
    });
  }

  const payments = bookings.map((b, i) => ({
    paymentId: `PAY-${String(i + 1).padStart(3, '0')}`,
    bookingId: b.bookingId,
    amount: b.totalAmount,
    paymentMethod: ["Cash", "UPI", "Card", "Online"][Math.floor(Math.random() * 4)],
    paymentStatus: b.paymentStatus,
    transactionId: `TXN${Math.floor(100000 + Math.random() * 899999)}`,
    paidAt: b.paymentStatus === "Paid" ? b.createdAt : null
  }));

  const cleaning = [];
  const cleaningRooms = rooms.filter(r => r.status === "Cleaning");
  for (let i = 1; i <= 80; i++) {
    const room = rooms[Math.floor(Math.random() * rooms.length)];
    cleaning.push({
      taskId: `CL-${String(i).padStart(3, '0')}`,
      roomId: room.roomId,
      status: i % 3 === 0 ? "Completed" : (i % 3 === 1 ? "In Progress" : "Pending"),
      assignedTo: ["Ravi", "Suresh", "Manoj", "Deepak"][Math.floor(Math.random() * 4)],
      startedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      completedAt: i % 3 === 0 ? new Date().toISOString() : null
    });
  }

  const summary = {
    totalRooms: 200,
    availableRooms: 70,
    occupiedRooms: 40,
    cleaningRooms: 20,
    maintenanceRooms: 20,
    todayCheckIns: 32,
    todayCheckOuts: 28,
    todayRevenue: payments.filter(p => p.paymentStatus === "Paid").reduce((acc, p) => acc + p.amount, 0)
  };

  return { rooms, customers, bookings, payments, cleaning, summary };
};

const data = generateData();
fs.writeFileSync('backend/dummyData.json', JSON.stringify(data, null, 2));
console.log("Dummy data generated successfully in backend/dummyData.json");
