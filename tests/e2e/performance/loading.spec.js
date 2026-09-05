import { test, expect, navigateAnalyzer } from '../../fixtures/audit-browser.js';
import { SAMPLE_DECKLISTS } from '../../fixtures/sample-decklists.js';

test.describe('Tests de Performance', () => {
  test('Temps de chargement initial', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    console.log(`Temps de chargement initial: ${loadTime}ms`);
    
    // Le site doit se charger en moins de 3 secondes
    expect(loadTime).toBeLessThan(3000);
  });

  test('Temps de navigation vers Analyzer', async ({ page }) => {
    await page.goto('/');
    
    const startTime = Date.now();
    await navigateAnalyzer(page);
    await expect(page.getByPlaceholder(/paste your decklist/i)).toBeVisible();
    
    const navigationTime = Date.now() - startTime;
    console.log(`Temps de navigation vers Analyzer: ${navigationTime}ms`);
    
    // La navigation doit être rapide (moins de 1 seconde)
    expect(navigationTime).toBeLessThan(1000);
  });

  test('Performance analyse decklist simple', async ({ page }) => {
    await page.goto('/');
    await navigateAnalyzer(page);
    
    await page.getByPlaceholder(/paste your decklist/i).fill(SAMPLE_DECKLISTS.simple);
    
    const startTime = Date.now();
    await page.getByRole('button', { name: /^Analyze Manabase$/i }).click();
    await expect(page.getByTestId('analysis-results')).toBeVisible();
    
    const analysisTime = Date.now() - startTime;
    console.log(`Temps d'analyse decklist simple: ${analysisTime}ms`);
    
    // L'analyse simple doit prendre moins de 3 secondes
    expect(analysisTime).toBeLessThan(3000);
  });

  test('Performance analyse decklist complexe', async ({ page }) => {
    await page.goto('/');
    await navigateAnalyzer(page);
    
    await page.getByPlaceholder(/paste your decklist/i).fill(SAMPLE_DECKLISTS.complex);
    
    const startTime = Date.now();
    await page.getByRole('button', { name: /^Analyze Manabase$/i }).click();
    await expect(page.getByTestId('analysis-results')).toBeVisible();
    
    const analysisTime = Date.now() - startTime;
    console.log(`Temps d'analyse decklist complexe: ${analysisTime}ms`);
    
    // L'analyse complexe doit prendre moins de 5 secondes
    expect(analysisTime).toBeLessThan(5000);
  });

  test('Performance navigation entre onglets', async ({ page }) => {
    await page.goto('/');
    await navigateAnalyzer(page);
    
    await page.getByPlaceholder(/paste your decklist/i).fill(SAMPLE_DECKLISTS.simple);
    await page.getByRole('button', { name: /^Analyze Manabase$/i }).click();
    await expect(page.getByTestId('analysis-results')).toBeVisible();
    
    const tabNames = ['tab-castability', 'tab-analysis', 'tab-mulligan', 'tab-manabase', 'tab-blueprint'];
    
    const tabSwitchTimes = [];
    
    for (const tabName of tabNames) {
      const tab = page.getByTestId(tabName);
      await expect(tab).toBeVisible();
        {
        const startTime = Date.now();
        await tab.click();
        await expect(page.getByRole('tabpanel').filter({ visible: true }).first()).toBeVisible();
        
        const switchTime = Date.now() - startTime;
        tabSwitchTimes.push(switchTime);
        console.log(`Temps de changement vers onglet ${tabName}: ${switchTime}ms`);
      }
    }
    
    // Chaque changement d'onglet doit prendre moins de 500ms
    tabSwitchTimes.forEach(time => {
      expect(time).toBeLessThan(500);
    });
  });

  test('Performance avec grande decklist', async ({ page }) => {
    // Créer une decklist de 100 cartes
    const largeDeck = '60 Island\n40 Mountain';
    
    await page.goto('/');
    await navigateAnalyzer(page);
    
    await page.getByPlaceholder(/paste your decklist/i).fill(largeDeck);
    
    const startTime = Date.now();
    await page.getByRole('button', { name: /^Analyze Manabase$/i }).click();
    await expect(page.getByTestId('analysis-results')).toBeVisible({ timeout: 10000 });
    
    const analysisTime = Date.now() - startTime;
    console.log(`Temps d'analyse grande decklist (100 cartes): ${analysisTime}ms`);
    
    // Même avec une grande decklist, l'analyse doit prendre moins de 8 secondes
    expect(analysisTime).toBeLessThan(8000);
  });
});

test.describe('Tests de Performance Réseau', () => {
  test('Performance avec connexion lente', async ({ page, context }) => {
    // Simuler une connexion 3G lente
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms de délai
      await route.continue();
    });
    
    const startTime = Date.now();
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    console.log(`Temps de chargement avec connexion lente: ${loadTime}ms`);
    
    // Même avec une connexion lente, le site doit se charger en moins de 5 secondes
    expect(loadTime).toBeLessThan(5000);
  });

  test('JavaScript disabled shows an explicit fallback', async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL })
    const page = await context.newPage()
    await page.goto('/')
    await expect(page.locator('body')).toContainText('ManaTuner requires JavaScript to analyze decks.', { useInnerText: true })
    await context.close()
  });
});

test.describe('Tests de Performance Mobile', () => {
  test('Performance chargement mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    const startTime = Date.now();
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    const loadTime = Date.now() - startTime;
    console.log(`Temps de chargement mobile: ${loadTime}ms`);
    
    // Sur mobile, le chargement ne doit pas être significativement plus lent
    expect(loadTime).toBeLessThan(4000);
  });

  test('Performance analyse mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await navigateAnalyzer(page);
    
    await page.getByPlaceholder(/paste your decklist/i).fill(SAMPLE_DECKLISTS.simple);
    
    const startTime = Date.now();
    await page.getByRole('button', { name: /^Analyze Manabase$/i }).click();
    await expect(page.getByTestId('analysis-results')).toBeVisible();
    
    const analysisTime = Date.now() - startTime;
    console.log(`Temps d'analyse mobile: ${analysisTime}ms`);
    
    // L'analyse sur mobile doit rester performante
    expect(analysisTime).toBeLessThan(4000);
  });

  test('Performance scroll mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await navigateAnalyzer(page);
    
    await page.getByPlaceholder(/paste your decklist/i).fill(SAMPLE_DECKLISTS.complex);
    await page.getByRole('button', { name: /^Analyze Manabase$/i }).click();
    await expect(page.getByTestId('analysis-results')).toBeVisible();
    
    // Mesurer la performance du scroll
    const startTime = Date.now();
    
    // Faire plusieurs scrolls rapides
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollBy(0, 200));
      await page.waitForTimeout(50);
    }
    
    const scrollTime = Date.now() - startTime;
    console.log(`Temps de scroll mobile: ${scrollTime}ms`);
    
    // Le scroll doit rester fluide
    expect(scrollTime).toBeLessThan(1000);
  });
});

test.describe('Tests de Mémoire et Ressources', () => {
  test('Utilisation mémoire normale', async ({ page }) => {
    await page.goto('/');
    await navigateAnalyzer(page);
    
    // Effectuer plusieurs analyses pour tester les fuites mémoire
    const decklists = [
      SAMPLE_DECKLISTS.simple,
      SAMPLE_DECKLISTS.complex,
      SAMPLE_DECKLISTS.aggro
    ];
    
    for (const decklist of decklists) {
      const expand = page.getByText(/Edit Deck/)
      if (await expand.isVisible()) await expand.click()
      await page.getByPlaceholder(/paste your decklist/i).clear();
      await page.getByPlaceholder(/paste your decklist/i).fill(decklist);
      await page.getByRole('button', { name: /^Analyze Manabase$/i }).click();
      await expect(page.getByTestId('analysis-results')).toBeVisible();
      
      // Petite pause entre les analyses
      await page.waitForTimeout(500);
    }
    
    // The editor is intentionally collapsed after analysis; reopen it.
    const expand = page.getByText(/Edit Deck/)
    if (await expand.isVisible()) await expand.click()
    await expect(page.getByRole('button', { name: /^Analyze Manabase$/i })).toBeVisible();
  });

  test('Performance avec multiples onglets', async ({ page }) => {
    await page.goto('/');
    await navigateAnalyzer(page);
    
    await page.getByPlaceholder(/paste your decklist/i).fill(SAMPLE_DECKLISTS.complex);
    await page.getByRole('button', { name: /^Analyze Manabase$/i }).click();
    await expect(page.getByTestId('analysis-results')).toBeVisible();
    
    // Changer rapidement entre tous les onglets plusieurs fois
    const tabNames = ['tab-castability', 'tab-analysis', 'tab-mulligan', 'tab-manabase', 'tab-blueprint'];
    
    const startTime = Date.now();
    
    // Faire 3 cycles complets entre tous les onglets
    for (let cycle = 0; cycle < 3; cycle++) {
      for (const tabName of tabNames) {
        const tab = page.getByTestId(tabName);
        await expect(tab).toBeVisible();
        {
          await tab.click();
          await expect(page.getByRole('tabpanel').filter({ visible: true }).first()).toBeVisible();
        }
      }
    }
    
    const totalTime = Date.now() - startTime;
    console.log(`Temps total navigation multiple onglets: ${totalTime}ms`);
    
    // La navigation multiple ne doit pas dégrader les performances
    expect(totalTime).toBeLessThan(3000);
  });
});

test.describe('Tests de Performance Comparative', () => {
  test('Comparaison Desktop vs Mobile', async ({ browser }) => {
    // Test Desktop
    const desktopContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const desktopPage = await desktopContext.newPage();
    
    const desktopStartTime = Date.now();
    await desktopPage.goto('/');
    await expect(desktopPage.getByRole('heading', { level: 1 })).toBeVisible();
    const desktopTime = Date.now() - desktopStartTime;
    
    await desktopContext.close();
    
    // Test Mobile
    const mobileContext = await browser.newContext({
      viewport: { width: 375, height: 667 }
    });
    const mobilePage = await mobileContext.newPage();
    
    const mobileStartTime = Date.now();
    await mobilePage.goto('/');
    await expect(mobilePage.getByRole('heading', { level: 1 })).toBeVisible();
    const mobileTime = Date.now() - mobileStartTime;
    
    await mobileContext.close();
    
    console.log(`Desktop: ${desktopTime}ms, Mobile: ${mobileTime}ms`);
    
    // La différence ne doit pas être trop importante
    const difference = Math.abs(desktopTime - mobileTime);
    expect(difference).toBeLessThan(2000);
  });

  test('Performance avec cache vs sans cache', async ({ page, context }) => {
    // Premier chargement (sans cache)
    const firstStartTime = Date.now();
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const firstLoadTime = Date.now() - firstStartTime;
    
    // Recharger la page (avec cache)
    const secondStartTime = Date.now();
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const secondLoadTime = Date.now() - secondStartTime;
    
    console.log(`Sans cache: ${firstLoadTime}ms, Avec cache: ${secondLoadTime}ms`);
    
    // Le cache doit améliorer les performances
    expect(secondLoadTime).toBeLessThan(3000);
  });
}); 