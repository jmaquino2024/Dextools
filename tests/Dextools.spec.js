import { test, expect, chromium } from '@playwright/test';
const fs = require('fs');
const path = require('path');

test('Project - Dextools Charts', async () => {

    // Define the folder where the screenshots will be saved
    const downloadFolder = 'C:\\Users\\johnm\\Dextools-Project\\Screenshots';

    // Ensure the folder exists, create it if not
    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder, { recursive: true });
        console.log('Screenshots folder created!');
    } else {
    }

    // Launch the browser in non-headless mode
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Set up the download listener to save the file to the 'Screenshots' folder
    page.on('download', (download) => {
        const downloadPath = path.join(downloadFolder, download.suggestedFilename());
        download.saveAs(downloadPath).then(() => {
            console.log(`File downloaded and saved to: ${downloadPath}`);
        }).catch((err) => {
            console.error('Download failed:', err);
        });
    });

    // Set viewport to full screen (1920x1080 as a common standard for maximized windows)
    await page.setViewportSize({ width: 1920, height: 1080 });

    await page.goto('https://www.dextools.io/app/en/token/link?t=1733218664567', {
        timeout: 90000, // 90 seconds
        waitUntil: 'domcontentloaded' // Ensure basic DOM content is loaded
    });

    // Wait for ads to load and then remove them
    await page.waitForTimeout(2000); // Wait for 2 seconds for ads to load
    await page.evaluate(() => {
        const adElements = document.querySelectorAll('.coinzilla-banner-container, .sevioads, .ad-container');
        adElements.forEach(ad => ad.remove()); // Remove any ad elements
    });

    // Locate the first iframe
    const firstIframeLocator = page.locator('iframe').first(); // Use locator.first()

    // Get the frame object
    const frame = firstIframeLocator.contentFrame();

    // Ensure the frame is loaded before proceeding
    if (!frame) {
        throw new Error('Frame not found or not loaded.');
    }

    // await page.pause();

    await page.waitForTimeout(500); 
    
    await frame.locator('div.apply-common-tooltip.customButton-qqNP9X6e.btn-fullscreen').nth(0).click();

    // Wait for the button to be visible
    await frame.locator('#header-toolbar-indicators button[aria-label="Indicators & Strategies"]').waitFor({ state: 'visible' });
    await frame.locator('#header-toolbar-indicators button[aria-label="Indicators & Strategies"]').click();

    // Wait for the search input to be visible
    await frame.locator('input.input-qm7Rg5MB[placeholder="Search"][data-role="search"]').waitFor({ state: 'visible', timeout: 5000 });

    // Interact with the search input
    const searchBox = frame.locator('input.input-qm7Rg5MB[placeholder="Search"][data-role="search"]');
    await searchBox.click(); // Focus the input field
    await searchBox.fill('Moving Average Triple'); // Enter the search text

    // Locate the "Moving Average Triple" item inside the iframe
    const movingAverageTriple = frame.locator('[data-title="Moving Average Triple"]');
    await movingAverageTriple.waitFor(); // Ensure the element is visible
    await movingAverageTriple.click(); // Click the element

    // Add a slight delay to ensure the input field is ready
    await page.waitForTimeout(500);

    // Locate the search input field and clear it
    const searchInput = frame.locator('input[placeholder="Search"]');
    await searchInput.click(); // Focus on the input field
    // await searchInput.fill(''); // Clear the field
    await searchInput.press('Control+A'); // Select all text
    await searchInput.press('Backspace'); // Clear using keyboard
    await page.waitForTimeout(300); // Add a small delay

    // Input "Relative Strength Index" with retries
    const input01 = frame.locator('input[placeholder="Search"]'); // Input field locator
    await input01.waitFor({ state: 'visible' }); // Ensure the input field is visible

    let attempt = 0;
    const maxAttempts = 3;
    let success = false;

    while (attempt < maxAttempts && !success) {
    try {
        await input01.fill('Relative Strength Index'); // Try filling the text
        const inputValue = await input01.inputValue(); // Verify the value
        if (inputValue === 'Relative Strength Index') {
        success = true; // Break if successfully filled
        }
    } catch (err) {
        console.warn(`Attempt ${attempt + 1} failed. Retrying...`);
    }
    attempt++;
    }

    if (!success) {
    throw new Error('Failed to input "Relative Strength Index" after multiple attempts.');
    }

    // Locate the "Moving Average Triple" item inside the iframe
    const relativeStrengthIndex = frame.locator('[data-title="Relative Strength Index"]');

    // Wait for the element to appear and click on it
    await relativeStrengthIndex.waitFor(); // Wait until the element is visible
    await relativeStrengthIndex.click(); // Click the element

    // Locate and click the button inside the iframe without waiting for visibility
    const closeButton = frame.locator('button[data-name="close"]');
    await closeButton.click(); // Perform the click

    // Click on the legend source item with the text "Moving Average Triple"
    await frame.locator('div[data-name="legend-source-item"] div.title-l31H9iuA:has-text("Moving Average Triple")').click();

    // Locate the "Moving Average Triple" item and click its "More" button
    await frame.locator(
        'div[data-name="legend-source-item"]:has-text("Moving Average Triple") div[data-name="legend-more-action"]'
      ).click();

    // Click on the menu item with the text "Settings…"
    await frame.locator('tr[data-role="menuitem"]:has-text("Settings…")').click();

    // Check if the 'Inputs' tab is already selected
    const isTabSelectedMA = await frame.locator('button#inputs').getAttribute('aria-selected');

    // If it's not selected, click the 'Inputs' tab to select it
    if (isTabSelectedMA === 'false') {
        await frame.locator('button#inputs').click();
        console.log('Clicked on the Inputs tab to select it.');
    } else {
    }

    // Fill in the first input field with the value '9' for "firstPeriods-input"
    await frame.locator('div[data-study-input-name="firstPeriods-input"] input.input-RUSovanF').fill('9');

    // Fill in the second input field with the value '21' for "secondPeriods-input"
    await frame.locator('div[data-study-input-name="secondPeriods-input"] input.input-RUSovanF').fill('21');

    // Fill in the third input field with the value '50' for "thirdPeriods-input"
    await frame.locator('div[data-study-input-name="thirdPeriods-input"] input.input-RUSovanF').fill('50');

    // Click on the submit button to apply the changes
    await frame.locator('button[name="submit"][data-name="submit-button"]').click();

    // Click on the title with the text "RSI" in the titles wrapper
    await frame.locator('.titlesWrapper-l31H9iuA .titleWrapper-l31H9iuA.mainTitle-l31H9iuA .title-l31H9iuA:has-text("RSI")').click();

    // Locate the "RSI" item and click its "More" button
    await frame.locator(
        'div[data-name="legend-source-item"]:has-text("RSI") div[data-name="legend-more-action"]'
    ).click();

    // Click on the "Settings…" option with the specified label
    await frame.locator('span[data-label="true"]:text("Settings…")').click();

    // Click on the 'Style' tab in the indicator properties dialog, ensuring it's selected
    await frame.locator('button[aria-selected="false"][data-id="indicator-properties-dialog-tabs-style"]').click();

    // Check the second checkbox input in the style tab, forcing the action if necessary
    await frame.locator('input.input-GZajBGIm').nth(1).check({ force: true });

    // Open the color picker for the second color swatch in the style tab
    await frame.locator('div.colorPicker-Sw_a4qpB div.swatch-Sw_a4qpB').nth(1).click();

    // Click the color swatch button with the specified style (yellow color: rgb(255, 235, 59))
    await frame.locator('button.swatch-sfn7Lezv[data-role="swatch"][style="color: rgb(255, 235, 59);"]').click();

    // Press the 'Escape' key to close any open dialogs or dropdowns
    await page.keyboard.press('Escape');

    // Click the submit button to apply changes
    await frame.locator('button[name="submit"] span.content-D4RPB3ZC').click();

    // Open the intervals dropdown menu from the toolbar
    await frame.locator('//div[@id="header-toolbar-intervals"]//button[contains(@class, "menu-S_1OCXUK")]').click();

    // Select the "4 hours" option from the intervals dropdown
    await frame.locator('//span[@class="label-jFqVJoPk" and text()="4 hours"]').click();

    // Wait for the element with class 'screen-otjoFNF2' to become visible
    await frame.locator('.screen-otjoFNF2').waitFor({ state: 'visible', timeout: 50000 });

    // Wait for the element to vanish (either hidden or detached)
    await frame.locator('.screen-otjoFNF2').waitFor({ state: 'hidden', timeout: 50000 });

    await page.waitForTimeout(700);

    // Click the "Go to" button to open the date selection dialog
    await frame.locator('button[aria-label="Go to"][data-name="go-to-date"]').click();

    // Check the value of the aria-selected attribute for the "Custom range" tab
    const isCustomRangeTabSelected = await frame.locator('button[role="tab"][id="CustomRange"]').getAttribute('aria-selected');

    // If the "Custom range" tab is not selected, click it
    if (isCustomRangeTabSelected === 'false') {
        await frame.locator('button[role="tab"][aria-selected="false"][id="CustomRange"]').click();
        // console.log('Clicked the Custom range tab to select it.');
    } else {
        // console.log('Custom range tab is already selected.');
    }

    const { DateTime: LuxonDateTime } = require('luxon'); // Renamed

    // Get the current date and calculate 25 days behind
    const todayDate = LuxonDateTime.now();
    const twentyFiveDaysAgo = todayDate.minus({ days: 25 }).toFormat('yyyy-LL-dd'); // Format it as 'yyyy-MM-dd'

    // Get today's date for the end date
    const todayFormattedDate = todayDate.toFormat('yyyy-LL-dd');

    // Locate and clear the start date field, then input the date 25 days behind
    await frame.locator('span.container-WDZ0PRNh input[name="start-date-range"]').fill('');
    await frame.locator('span.container-WDZ0PRNh input[name="start-date-range"]').fill(twentyFiveDaysAgo);
    console.log(`Start date set to: ${twentyFiveDaysAgo}`);

    // Locate and clear the end date field, then input the current date
    await frame.locator('span.container-WDZ0PRNh input[name="end-date-range"]').fill('');
    await frame.locator('span.container-WDZ0PRNh input[name="end-date-range"]').fill(todayFormattedDate);
    console.log(`End date set to: ${todayFormattedDate}`);

    // Click the "Go to" button to open the navigation or date selection menu
    await frame.locator('button:has-text("Go to")').click();

    // Locate the button using the aria-label attribute and click it
    await frame.locator('button[aria-label="Take a snapshot"]').nth(2).click();
    
    // Use data-name and the span containing 'Download image' and click it
    await frame.locator('div[data-name="save-chart-image"] >> text="Download image"').click();
    
    // Wait for the download to complete
    await page.waitForEvent('download'); // This will wait until the download event is fired
    
    console.log('Download completed and saved in:', downloadFolder);
    
    await frame.locator('div[data-name="legend-source-item"] div.title-l31H9iuA:has-text("Moving Average Triple")').click();

    // Locate the "Moving Average Triple" item and click its "More" button
    await frame.locator(
        'div[data-name="legend-source-item"]:has-text("Moving Average Triple") div[data-name="legend-more-action"]'
      ).click();

    // Find the "Remove" text and click the parent element
    await frame.locator('tr:has(span.label-GJX1EXhk:has-text("Remove"))').click();

    // Wait for the button to be visible
    await frame.locator('#header-toolbar-indicators button[aria-label="Indicators & Strategies"]').waitFor({ state: 'visible' });
    await frame.locator('#header-toolbar-indicators button[aria-label="Indicators & Strategies"]').click();

    // Wait for the search input to be visible
    await frame.locator('input.input-qm7Rg5MB[placeholder="Search"][data-role="search"]').waitFor({ state: 'visible', timeout: 5000 });

    // Interact with the search input
    const searchBoxOne = frame.locator('input.input-qm7Rg5MB[placeholder="Search"][data-role="search"]');
    await searchBoxOne.click(); // Focus the input field
    await searchBoxOne.fill('Moving Average Double'); // Enter the search text

    // Locate the "Moving Average Double" item inside the iframe
    const MovingAverageDouble = frame.locator('[data-title="Moving Average Double"]');
    await MovingAverageDouble.waitFor(); // Ensure the element is visible
    await MovingAverageDouble.click(); // Click the element

    // Locate and click the button inside the iframe without waiting for visibility
    const closeButtonIndi = frame.locator('button[data-name="close"]');
    await closeButtonIndi.click(); // Perform the click

    // Click on the legend source title for "Moving Average Double" to focus or interact with it
    await frame.locator('//div[@data-name="legend-source-title" and .//div[contains(text(), "Moving Average Double")]]').click();

    // Click the "More Action" button in the legend section (targeting the third instance)
    await frame.locator('//div[@data-name="legend-more-action"]').nth(2).click();

    // Click on the "Settings…" menu item from the dropdown that appears
    await frame.locator('tr[data-role="menuitem"] .label-GJX1EXhk[data-label="true"]:has-text("Settings…")').click();

    // Check the value of the aria-selected attribute
    const isSelected = await frame.locator('button[role="tab"][id="inputs"]').getAttribute('aria-selected');

    // If the tab is not selected, click it
    if (isSelected === 'false') {
        await frame.locator('button[role="tab"][aria-selected="false"][id="inputs"]').click();
    } else {
    }

    // Fill the "First Periods" input field with the value '20'
    await frame.locator('div[data-study-input-name="firstPeriods-input"] input').fill('20');

    // Fill the "Second Periods" input field with the value '50'
    await frame.locator('div[data-study-input-name="secondPeriods-input"] input').fill('50');

    // Click the "Submit" button to save the current changes or settings
    await frame.locator('button[name="submit"][data-name="submit-button"]').click();
    // Open the intervals menu in the header toolbar
    await frame.locator('//div[@id="header-toolbar-intervals"]//button[contains(@class, "menu-S_1OCXUK")]').click();

    // Select the "1 day" interval option from the dropdown
    await frame.locator('//span[@class="label-jFqVJoPk" and text()="1 day"]').click();

    // Wait for the element with class 'screen-otjoFNF2' to become visible
    await frame.locator('.screen-otjoFNF2').waitFor({ state: 'visible', timeout: 50000 });

    // Wait for the element to vanish (either hidden or detached)
    await frame.locator('.screen-otjoFNF2').waitFor({ state: 'hidden', timeout: 50000 });

    await page.waitForTimeout(700);

    // Click the "Go to" button to open the date selection dialog
    await frame.locator('button[aria-label="Go to"][data-name="go-to-date"]').click();

    // Check the value of the aria-selected attribute for the "Custom range" tab
    const isCustomRangeSelected = await frame.locator('button[role="tab"][id="CustomRange"]').getAttribute('aria-selected');

    // If the "Custom range" tab is not selected, click it
    if (isCustomRangeSelected === 'false') {
        await frame.locator('button[role="tab"][aria-selected="false"][id="CustomRange"]').click();
        // console.log('Clicked the Custom range tab to select it.');
    } else {
        // console.log('Custom range tab is already selected.');
    }

    const { DateTime } = require('luxon');

    // Get the current date and calculate 5 months behind
    const currentDate = DateTime.now();
    const threeMonthsBehind = currentDate.minus({ months: 5 }).toFormat('yyyy-LL-dd'); // Format it as 'yyyy-MM-dd'
    
    // Get today's date for the end date
    const currentFormattedDate = currentDate.toFormat('yyyy-LL-dd');
    
    // Locate and clear the start date field, then input the date 3 months behind
    await frame.locator('span.container-WDZ0PRNh input[name="start-date-range"]').fill('');
    await frame.locator('span.container-WDZ0PRNh input[name="start-date-range"]').fill(threeMonthsBehind);
    console.log(`Start date set to: ${threeMonthsBehind}`);
    
    // Locate and clear the end date field, then input the current date
    await frame.locator('span.container-WDZ0PRNh input[name="end-date-range"]').fill('');
    await frame.locator('span.container-WDZ0PRNh input[name="end-date-range"]').fill(currentFormattedDate);
    console.log(`End date set to: ${currentFormattedDate}`);
    
    // Click the "Go to" button to open the navigation or date selection menu
    await frame.locator('button:has-text("Go to")').click();

    // Locate the button using the aria-label attribute and click it
    await frame.locator('button[aria-label="Take a snapshot"]').nth(2).click();

    // Use data-name and the span containing 'Download image' and click it
    await frame.locator('div[data-name="save-chart-image"] >> text="Download image"').click();

    // Wait for the download to complete
    await page.waitForEvent('download'); // This will wait until the download event is fired

    console.log('Download completed and saved in:', downloadFolder);

    // Click on the legend source title for "Moving Average Double" to focus or interact with it
    await frame.locator('//div[@data-name="legend-source-title" and .//div[contains(text(), "Moving Average Double")]]').click();

    await frame.locator('//div[@data-name="legend-more-action"]').nth(2).click();  // Clicks the first match

    // Find the "Remove" text and click the parent element
    await frame.locator('tr:has(span.label-GJX1EXhk:has-text("Remove"))').click();

    // Wait for the button to be visible
    await frame.locator('#header-toolbar-indicators button[aria-label="Indicators & Strategies"]').waitFor({ state: 'visible' });
    await frame.locator('#header-toolbar-indicators button[aria-label="Indicators & Strategies"]').click();

    // Wait for the search input to be visible
    await frame.locator('input.input-qm7Rg5MB[placeholder="Search"][data-role="search"]').waitFor({ state: 'visible', timeout: 5000 });

    // Interact with the search input
    const searchBoxTwo = frame.locator('input.input-qm7Rg5MB[placeholder="Search"][data-role="search"]');
    await searchBoxTwo.click(); // Focus the input field
    await searchBoxTwo.fill('Moving Average'); // Enter the search text

    // Locate the "Moving Average" item inside the iframe
    const MovingAverage = frame.locator('[data-title="Moving Average"]');
    await MovingAverage.waitFor(); // Ensure the element is visible
    await MovingAverage.click(); // Click the element

    // Locate and click the button inside the iframe without waiting for visibility
    const closeButtonIndicator = frame.locator('button[data-name="close"]');
    await closeButtonIndicator.click(); // Perform the click

    // Click on the main title ("MA") inside the frame
    await frame.locator("//div[@data-name='legend-source-title']//div[text()='MA']").click();

    // Click the "More Actions" button for the second legend item in the list
    await frame.locator('//div[@data-name="legend-more-action"]').nth(2).click();

    // Select the "Settings…" option from the dropdown menu
    await frame.locator('tr[data-role="menuitem"] .label-GJX1EXhk[data-label="true"]:has-text("Settings…")').click();

    // Check if the 'Inputs' tab is already selected
    const isTabSelected = await frame.locator('button#inputs').getAttribute('aria-selected');

    // If it's not selected, click the 'Inputs' tab to select it
    if (isTabSelected === 'false') {
        await frame.locator('button#inputs').click();
        console.log('Clicked on the Inputs tab to select it.');
    } else {
    }

    // Select the first input field and fill it with '50'
    await frame.locator('div.inner-tBgV1m0B input.input-RUSovanF').nth(0).fill('50');

    // Click the "Submit" button to save the changes
    await frame.locator('button[name="submit"][data-name="submit-button"]').click();

    // Open the intervals dropdown menu in the header toolbar
    await frame.locator('//div[@id="header-toolbar-intervals"]//button[contains(@class, "menu-S_1OCXUK")]').click();

    // Select the "1 week" interval option from the dropdown menu
    await frame.locator('span.label-jFqVJoPk >> text="1 week"').click();

    // Wait for the element with class 'screen-otjoFNF2' to become visible
    await frame.locator('.screen-otjoFNF2').waitFor({ state: 'visible', timeout: 50000 });

    // Wait for the element to vanish (either hidden or detached)
    await frame.locator('.screen-otjoFNF2').waitFor({ state: 'hidden', timeout: 50000 });

    // Wait for a brief timeout to ensure everything is fully loaded
    await page.waitForTimeout(1000);

    // Click the "Go to" button to open the date selection dialog
    await frame.locator('button[aria-label="Go to"][data-name="go-to-date"]').click();

    // Check the value of the aria-selected attribute for the "Custom range" tab
    const isCustomRangeTabActive = await frame.locator('button[role="tab"][id="CustomRange"]').getAttribute('aria-selected');

    // If the "Custom range" tab is not selected, click it
    if (isCustomRangeTabActive === 'false') {
        await frame.locator('button[role="tab"][aria-selected="false"][id="CustomRange"]').click();
        // console.log('Clicked the Custom range tab to select it.');
    } else {
        // console.log('Custom range tab is already selected.');
    }

    const { DateTime: LuxonDate } = require('luxon'); // Renamed to LuxonDate

    // Get the current date and calculate 3 years behind
    const currentDateTime = LuxonDate.now();
    const threeYearsAgo = currentDateTime.minus({ years: 3 }).toFormat('yyyy-LL-dd'); // Format it as 'yyyy-MM-dd'

    // Get today's date for the end date
    const currentEndDate = currentDateTime.toFormat('yyyy-LL-dd'); // Renamed to avoid duplication

    // Locate and clear the start date field, then input the date 3 years behind
    await frame.locator('span.container-WDZ0PRNh input[name="start-date-range"]').fill('');
    await frame.locator('span.container-WDZ0PRNh input[name="start-date-range"]').fill(threeYearsAgo);
    console.log(`Start date set to: ${threeYearsAgo}`);

    // Locate and clear the end date field, then input the current date
    await frame.locator('span.container-WDZ0PRNh input[name="end-date-range"]').fill('');
    await frame.locator('span.container-WDZ0PRNh input[name="end-date-range"]').fill(currentEndDate);
    console.log(`End date set to: ${currentEndDate}`);

    // Click the "Go to" button to open the navigation or date selection menu
    await frame.locator('button:has-text("Go to")').click();

    // Locate the button using the aria-label attribute and click it
    await frame.locator('button[aria-label="Take a snapshot"]').nth(2).click();

    // Use data-name and the span containing 'Download image' and click it
    await frame.locator('div[data-name="save-chart-image"] >> text="Download image"').click();

    // Wait for the download to complete
    await page.waitForEvent('download'); // This will wait until the download event is fired

    console.log('Download completed and saved in:', downloadFolder);

    // Final delay to view the page after all clicks
    await page.waitForTimeout(1000);

    await browser.close();
});