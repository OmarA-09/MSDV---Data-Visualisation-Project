# MSDV - Data Visualisation

Data Visualisation Coursework

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A code editor (VS Code, WebStorm, IntelliJ IDEA, etc.)
- Live server extension or similar tool for local development

## Running the Project

### Option 1: Using VS Code

1. **Install VS Code** if you haven't already from [https://code.visualstudio.com/](https://code.visualstudio.com/)

2. **Install Live Server Extension:**
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Search for "Live Server" by Ritwick Dey
   - Click Install

3. **Open the Project:**
   - Open VS Code
   - Go to File → Open Folder
   - Select the project folder containing your files

4. **Run the Project:**
   - Right-click on `index_f_2.html` in the Explorer panel
   - Select "Open with Live Server"
   - Your default browser will open with the project running on `http://localhost:5500`

### Option 2: Using JetBrains IDEs (WebStorm, IntelliJ IDEA)

1. **Install WebStorm** from [https://www.jetbrains.com/webstorm/](https://www.jetbrains.com/webstorm/) or use IntelliJ IDEA with JavaScript support

2. **Open the Project:**
   - Open WebStorm/IntelliJ IDEA
   - Click "Open" and select your project folder

3. **Run the Project:**
   - Right-click on `index_f_2.html` in the Project panel
   - Select "Open in Browser" or "Run"
   - Alternatively, you can use the built-in web server:
     - Right-click on `index_f_2.html`
     - Choose "Open in Browser" → "Built-in Preview"

<img width="1040" height="735" alt="image" src="https://github.com/user-attachments/assets/bf8a0c34-5a91-4144-82f2-9815ace23792" />

https://github.com/OmarA-09/MSDV/blob/main/video_presentation.mp4

<div class="about-section">
                <h2>About the Visualisation:</h2>
                <h3>Research Question:</h3>
                <p>To what extent does economic prosperity influence a country's Olympic medal success (1984-2020)?</p>
                <h3>Data Sources and Preprocessing:</h3>
                <ul>
                    <li><strong>Olympic Medal Data:</strong> <a
                            href="https://www.kaggle.com/datasets/stefanydeoliveira/summer-olympics-medals-1896-2024/data"
                            target="_blank">Summer Olympics Medals (1896-2024)</a> - Contains medal counts by country
                        and Olympic year</li>
                    <li><strong>GDP Per Capita Data:</strong> <a
                            href="https://www.kaggle.com/datasets/zgrcemta/world-gdpgdp-gdp-per-capita-and-annual-growths"
                            target="_blank">World GDP & GDP Per Capita</a> - Provides economic indicators by country
                        over time</li>
                    <li><strong>Data Integration:</strong> Datasets were joined based on country code (NOC) and year to
                        append one column from the GDP to the Olympic dataset.</li>
                </ul>
            </div>

