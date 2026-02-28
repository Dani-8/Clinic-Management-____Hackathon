export const generateClinicalPDF = (p) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("Clinical Document", 20, 20);
        doc.setFontSize(12);
        doc.text(`Patient: ${p.patientName}`, 20, 40);
        doc.text(`${p.role === 'receptionist' ? 'Staff' : 'Doctor'}: ${p.doctorName}`, 20, 50);
        doc.text(`Date: ${new Date(p.date).toLocaleDateString()}`, 20, 60);
        doc.line(20, 65, 190, 65);
        doc.setFont("helvetica", "italic");
        doc.text("Notes & Instructions:", 20, 75);
        doc.setFont("helvetica", "normal");
        const splitText = doc.splitTextToSize(p.notes, 160);
        doc.text(splitText, 20, 85);
        doc.save(`Record_${p.patientName}_${new Date().getTime()}.pdf`);
    };
    document.head.appendChild(script);
};