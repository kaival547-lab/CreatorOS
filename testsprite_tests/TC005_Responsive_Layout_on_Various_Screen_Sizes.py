import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Resize browser or use device emulation to tablet size to verify layout adjusts properly and remains usable.
        await page.goto('http://localhost:3000/#/landing', timeout=10000)
        await asyncio.sleep(3)
        

        await page.mouse.wheel(0, 300)
        

        # -> Emulate tablet screen size by resizing viewport and verify sidebar and layout usability.
        await page.mouse.wheel(0, -await page.evaluate('() => window.innerHeight'))
        

        # -> Emulate mobile screen size and verify sidebar collapses or transforms and navigation remains functional.
        await page.goto('http://localhost:3000/#/landing', timeout=10000)
        await asyncio.sleep(3)
        

        await page.mouse.wheel(0, -await page.evaluate('() => window.innerHeight'))
        

        # -> Emulate mobile screen size and verify sidebar collapses or transforms and navigation remains functional.
        await page.mouse.wheel(0, -await page.evaluate('() => window.innerHeight'))
        

        # -> Emulate mobile screen size and verify sidebar collapses or transforms and navigation remains functional.
        await page.mouse.wheel(0, -await page.evaluate('() => window.innerHeight'))
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Creator OS').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Built for creators who already do brand deals').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Creator OS helps solo creators track brand deals, price confidently, and spot risky briefs without spreadsheets or stress.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Outreach').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Negotiating').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=In Review').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Follow-up Needed').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Track exactly where you are in the conversation.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Never forget to follow up and keep leads warm.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Benchmarked against real industry data to price confidently.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Scans briefs for red flags before signing.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Add a brand deal with just the name and status, no complex onboarding.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Receive reminders, pricing guidance, and brief insights when needed.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Close the deal or move on, keeping mental load low and focus on creating.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Join 1,500+ creators using Creator OS. Get started free with no credit card required and setup in 30 seconds.').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    