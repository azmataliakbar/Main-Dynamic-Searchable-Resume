// Define the bullet template
const bulletPlaceholder = ' • ';

// Function to initialize textareas with bullets
function initializeTextareasWithBullets(): void {
  const educationTextarea = <HTMLTextAreaElement>document.getElementById('education');
  const skillsTextarea = <HTMLTextAreaElement>document.getElementById('skills');
  const workExperienceTextarea = <HTMLTextAreaElement>document.getElementById('workExperience');

  // Add bullets as the initial content for each textarea
  educationTextarea.value = generateBullets(4);
  skillsTextarea.value = generateBullets(4);
  workExperienceTextarea.value = generateBullets(4);
}

// Generates the initial content for multiple rows with bullets
function generateBullets(rows: number): string {
  let bullets = '';
  for (let i = 0; i < rows; i++) {
    bullets += '• \n'; // Bullet followed by a newline
  }
  return bullets.trim(); // Trim the last newline
}

// Initialize the textareas with bullets when the page loads
window.onload = initializeTextareasWithBullets;

// Function to handle bullet input
function handleBulletInput(event: Event): void {
  const inputElement = <HTMLTextAreaElement>event.target;
  const inputValue = inputElement.value;
  const lines = inputValue.split('\n');

  // Ensure each line starts with a bullet
  const newLines = lines.map(line => (line.startsWith('•') ? line : `• ${line.trim()}`));

  // Update the textarea content
  inputElement.value = newLines.join('\n');
}

// Add event listeners to prevent clearing bullets
['education', 'skills', 'workExperience'].forEach(id => {
  const element = document.getElementById(id) as HTMLTextAreaElement;
  element.addEventListener('input', handleBulletInput);
});

// Handle form submission to generate the resume
document.getElementById('resumeForm')?.addEventListener('submit', function (event: Event): void {
  event.preventDefault(); // Prevent form submission

  // Get values from form fields
  const name = (<HTMLInputElement>document.getElementById('name')).value;
  const email = (<HTMLInputElement>document.getElementById('email')).value;
  const phone = (<HTMLInputElement>document.getElementById('phone')).value;
  const education = formatTextareaAsList('education');
  const skills = formatTextareaAsList('skills');
  const workExperience = formatTextareaAsList('workExperience');

  // Generate resume content
  const resumeContent = `
    <h2 style="font-size: 14px; padding: 0px 20px 0px 10px;"><u>My Resume</u></h2>
    <p style="font-size: 10px; padding: 30px 20px 0px 10px;"><strong>Name:</strong> ${name}</p>
    <p style="font-size: 10px; padding: 0px 20px 0px 10px;"><strong>Email:</strong> ${email}</p>
    <p style="font-size: 10px; padding: 0px 20px 0px 10px;"><strong>Phone:</strong> ${phone}</p>

    <p style="font-size: 10px; padding: 30px 20px 0px 10px;"><strong>Education:</strong></p>
    <ul style="font-family: Arial, sans-serif; font-size: 10px; padding: 0px 20px 0px 10px; list-style-position: inside;">${education}</ul>

    <p style="font-size: 10px; padding: 30px 20px 0px 10px;"><strong>Skills:</strong></p>
    <ul style="font-family: Arial, sans-serif; font-size: 10px; padding: 0px 20px 0px 10px; list-style-position: inside;">${skills}</ul>

    <p style="font-size: 10px; padding: 30px 20px 0px 10px;"><strong>Work Experience:</strong></p>
    <ul style="font-family: Arial, sans-serif; font-size: 10px; padding: 0px 20px 0px 10px; list-style-position: inside;">${workExperience}</ul>
  `;

  // Display the generated resume
  const resumeDiv = <HTMLDivElement>document.getElementById('resume');
  resumeDiv.innerHTML = resumeContent;

  // Show the "Download as PDF" button
  const downloadButton = <HTMLButtonElement>document.getElementById('download-btn');
  downloadButton.style.display = 'inline-block';
  downloadButton.onclick = function () {
    downloadResumeAsPDF('resume.pdf');
  };
});

// Handle form submission to generate the resume and shareable link
document.getElementById('resumeForm')?.addEventListener('submit', function (event: Event): void {
  event.preventDefault(); // Prevent form submission

  // Get form values
  const name = (<HTMLInputElement>document.getElementById('name')).value;
  const email = (<HTMLInputElement>document.getElementById('email')).value;
  const phone = (<HTMLInputElement>document.getElementById('phone')).value;

  // Construct a shareable URL with form data as query parameters
  const shareableURL = `https://giaic-info-site.vercel.app/resume/${encodeURIComponent(name)}?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;
  
  // Set the generated shareable URL in the input field
  const shareableLinkInput = <HTMLInputElement>document.getElementById('shareableLink');
  shareableLinkInput.value = shareableURL;

  // Optionally, show the "Copy Link" button if it's hidden
  document.getElementById('copyLink')!.style.display = 'inline-block';
});

// Handle "Copy Link" button functionality
document.getElementById('copyLink')?.addEventListener('click', function (): void {
  const shareableLinkInput = <HTMLInputElement>document.getElementById('shareableLink');
  shareableLinkInput.select(); // Select the content of the input field
  document.execCommand('copy'); // Copy the selected text to clipboard
  alert('Link copied to clipboard!');
});

// Format textarea content as list items
function formatTextareaAsList(textareaId: string): string {
  const content = (<HTMLTextAreaElement>document.getElementById(textareaId)).value;
  return content
    .split('\n')
    .filter(line => line.trim() !== '')
    .map(line => `<li>${line.trim()}</li>`)
    .join('');
}

declare var html2pdf: any;

// Function to download resume as PDF
function downloadResumeAsPDF(filename: string): void {
  const element = <HTMLDivElement>document.getElementById('resume');
  const options = {
    margin: [10, 10, 10, 10],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 1.5 },
    jsPDF: { unit: 'px', format: 'a4', orientation: 'portrait' },
  };

  

  html2pdf().set(options).from(element).save();
}

// Copy shareable link to clipboard
document.getElementById('copyLink')?.addEventListener('click', function (): void {
  const linkInput = <HTMLInputElement>document.getElementById('shareableLink');
  linkInput.select();
  linkInput.setSelectionRange(0, 99999); // For mobile devices
  navigator.clipboard.writeText(linkInput.value)
    .then(() => alert('Link copied to clipboard!'))
    .catch(err => alert('Failed to copy the link.'));
});
