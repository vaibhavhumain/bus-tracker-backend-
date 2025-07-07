const BusOrder = require('../models/BusOrder');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
exports.createBusOrder = async (req, res) => {
  try {
    if (req.user.role === 'customer') {
      return res.status(403).json({ error: "Access denied: only employees/admin can do" });
    }
    if (!req.body.clientPhone) {
      return res.status(400).json({ error: "client phone is required" });
    }
    const newOrder = new BusOrder(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: "Failed to create bus order" });
  }
};

exports.getAllBusOrders = async (req, res) => {
  try {
    const role = req.user.role;
    const phone = req.user.phone;
    let buses;

    if (role === 'customer') {
      buses = await BusOrder.find({ clientPhone: phone }).sort({ updatedAt: -1 });
    } else {
      buses = await BusOrder.find().sort({ updatedAt: -1 });
    }

    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bus orders" });
  }
};


exports.getBusOrderById = async (req, res) => {
  try {
    const bus = await BusOrder.findById(req.params.id);
    if (!bus) {
      return res.status(404).json({ error: "Bus not found" });
    }
    res.status(200).json(bus);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bus order" });
  }
};

exports.updateProgressStage = async (req, res) => {
  try {
    if (req.user.role === 'customer') {
      return res.status(403).json({ error: "Access denied" });
    }

    const { id } = req.params;
    const { progressStage } = req.body;

    const updatedBus = await BusOrder.findByIdAndUpdate(
      id,
      { progressStage },
      { new: true }
    );

    if (!updatedBus) {
      return res.status(404).json({ error: "Bus order not found" });
    }

    res.status(200).json(updatedBus);
  } catch (err) {
    res.status(500).json({ error: "Failed to update bus order progress stage" });
  }
};

exports.addProgressLog = async (req, res) => {
  try {
    if (req.user.role === 'customer') {
      return res.status(403).json({ error: "Access denied" });
    }

    const { id } = req.params;
    const { stage, date, remark } = req.body;

    const bus = await BusOrder.findById(id);
    if (!bus) return res.status(404).json({ error: "Bus order not found" });

    bus.progressLog.push({ stage, date, remark });
    await bus.save();

    res.status(200).json(bus);
  } catch (err) {
    res.status(500).json({ error: "Failed to add progress log" });
  }
};

exports.uploadBusMedia = async (req, res) => {
  try {
    if (req.user.role === 'customer') {
      return res.status(403).json({ error: "Access denied" });
    }

    const { id } = req.params;
    const { url, type } = req.body;

    const bus = await BusOrder.findById(id);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    bus.media.push({ type, url });
    await bus.save();

    res.status(200).json({ success: true, bus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload media' });
  }
};

exports.deleteBusOrder = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Only admins can delete orders' });
    }

    const { id } = req.params;
    const deletedBus = await BusOrder.findByIdAndDelete(id);

    if (!deletedBus) {
      return res.status(404).json({ error: 'Bus order not found' });
    }

    res.status(200).json({ message: 'Bus order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete bus order' });
  }
};


exports.generateAndSaveBusPdf = async (req, res) => {
  try {
    const busId = req.params.id;
    const bus = await BusOrder.findById(busId);

    if (!bus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', async () => {
      const pdfData = Buffer.concat(buffers);

      bus.progressPdf = pdfData;
bus.contentType = 'application/pdf';
await bus.save();


      res.status(200).json({ message: 'PDF generated and saved successfully' });
    });

    // Start writing to PDF
    doc.fontSize(20).text(`Bus Progress Report`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text(`Bus Number: ${bus.busNumber}`);
    doc.text(`Client Name: ${bus.clientName}`);
    doc.text(`Current Stage: ${bus.progressStage}`);
    doc.moveDown();

    doc.text(`Progress Logs:`);
    doc.moveDown();

    if (bus.progressLog && bus.progressLog.length > 0) {
  bus.progressLog.forEach((log, i) => {
        doc.text(`${i + 1}. Stage: ${log.stage}`);
        doc.text(`   Remark: ${log.remark}`);
        doc.text(`   Date: ${new Date(log.date).toLocaleDateString()}`);
        doc.moveDown();
      });
    } else {
      doc.text('No logs found.');
    }

    doc.end();

  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
};

exports.downloadBusPdf = async (req, res) => {
  try {
    const bus = await BusOrder.findById(req.params.id);

    if (!bus || !bus.progressPdf) {
      return res.status(404).json({ message: 'PDF not found for this bus' });
    }

    res.set({
      'Content-Type': bus.contentType || 'application/pdf',
      'Content-Disposition': 'attachment; filename=bus-progress.pdf',
    });

    res.send(bus.progressPdf);
  } catch (error) {
    console.error('Download PDF error:', error);
    res.status(500).json({ message: 'Failed to download PDF' });
  }
};
