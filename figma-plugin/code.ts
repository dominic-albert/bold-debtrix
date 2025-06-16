// Figma plugin main code
figma.showUI(__html__, { 
  width: 420, 
  height: 700,
  themeColors: true 
});

// Store API key and user data
let apiKey: string | null = null;
let userData: any = null;
let config: { apiBaseUrl: string; anonKey: string } | null = null;

// Load stored data on startup
async function loadStoredData() {
  try {
    const [storedKey, storedConfig] = await Promise.all([
      figma.clientStorage.getAsync('debtrix_api_key'),
      figma.clientStorage.getAsync('debtrix_config')
    ]);
    
    if (storedConfig) {
      config = storedConfig;
      figma.ui.postMessage({ type: 'config-loaded', config: storedConfig });
    }
    
    if (storedKey && storedConfig) {
      apiKey = storedKey;
      figma.ui.postMessage({ type: 'api-key-loaded', apiKey: storedKey });
    }
  } catch (error) {
    console.error('Error loading stored data:', error);
  }
}

// Initialize
loadStoredData();

// Listen for messages from UI
figma.ui.onmessage = async (msg) => {
  try {
    switch (msg.type) {
      case 'load-config':
        const storedConfig = await figma.clientStorage.getAsync('debtrix_config');
        figma.ui.postMessage({ type: 'config-loaded', config: storedConfig });
        break;
        
      case 'save-config':
        config = msg.config;
        await figma.clientStorage.setAsync('debtrix_config', config);
        break;
        
      case 'verify-api-key':
        config = { apiBaseUrl: msg.apiBaseUrl, anonKey: msg.anonKey };
        await verifyApiKey(msg.apiKey);
        break;
        
      case 'get-projects':
        await getProjects();
        break;
        
      case 'get-ux-debts':
        await getUXDebts(msg.projectId);
        break;
        
      case 'create-ux-debt':
        await createUXDebt(msg.projectId, msg.debtData);
        break;
        
      case 'update-ux-debt':
        await updateUXDebt(msg.projectId, msg.debtId, msg.debtData);
        break;
        
      case 'delete-ux-debt':
        await deleteUXDebt(msg.projectId, msg.debtId);
        break;
        
      case 'get-figma-context':
        await getFigmaContext();
        break;
        
      case 'logout':
        await figma.clientStorage.deleteAsync('debtrix_api_key');
        apiKey = null;
        userData = null;
        break;
        
      case 'close-plugin':
        figma.closePlugin();
        break;
    }
  } catch (error) {
    console.error('Error handling message:', error);
    figma.ui.postMessage({ 
      type: 'error', 
      error: error.message || 'An unexpected error occurred' 
    });
  }
};

async function verifyApiKey(key: string) {
  if (!config) {
    figma.ui.postMessage({ 
      type: 'api-key-verified', 
      success: false, 
      error: 'Configuration not found' 
    });
    return;
  }
  
  try {
    const response = await fetch(`${config.apiBaseUrl}/rest/v1/profiles?select=id,email,full_name`, {
      headers: {
        'apikey': config.anonKey,
        'x-api-key': key,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    if (!data || data.length === 0) {
      throw new Error('Invalid API key - no user found');
    }
    
    apiKey = key;
    userData = data[0];
    
    // Store API key
    await figma.clientStorage.setAsync('debtrix_api_key', key);
    
    figma.ui.postMessage({ 
      type: 'api-key-verified', 
      success: true, 
      user: userData 
    });
  } catch (error) {
    console.error('API key verification error:', error);
    figma.ui.postMessage({ 
      type: 'api-key-verified', 
      success: false, 
      error: error.message || 'Failed to verify API key'
    });
  }
}

async function getProjects() {
  if (!apiKey || !userData || !config) {
    figma.ui.postMessage({ 
      type: 'projects-loaded', 
      success: false, 
      error: 'Not authenticated or configured' 
    });
    return;
  }
  
  try {
    const response = await fetch(`${config.apiBaseUrl}/rest/v1/projects?owner_id=eq.${userData.id}&select=id,title,description,color,created_at,updated_at&order=updated_at.desc`, {
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const projects = await response.json();
    
    figma.ui.postMessage({ 
      type: 'projects-loaded', 
      success: true, 
      projects 
    });
  } catch (error) {
    console.error('Get projects error:', error);
    figma.ui.postMessage({ 
      type: 'projects-loaded', 
      success: false, 
      error: error.message || 'Failed to fetch projects'
    });
  }
}

async function getUXDebts(projectId: string) {
  if (!apiKey || !config) {
    figma.ui.postMessage({ 
      type: 'ux-debts-loaded', 
      success: false, 
      error: 'Not authenticated' 
    });
    return;
  }
  
  try {
    const response = await fetch(`${config.apiBaseUrl}/rest/v1/ux_debts?project_id=eq.${projectId}&select=*&order=created_at.desc`, {
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const debts = await response.json();
    
    figma.ui.postMessage({ 
      type: 'ux-debts-loaded', 
      success: true, 
      debts 
    });
  } catch (error) {
    console.error('Get UX debts error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debts-loaded', 
      success: false, 
      error: error.message || 'Failed to fetch UX debts'
    });
  }
}

async function createUXDebt(projectId: string, debtData: any) {
  if (!apiKey || !userData || !config) {
    figma.ui.postMessage({ 
      type: 'ux-debt-created', 
      success: false, 
      error: 'Not authenticated' 
    });
    return;
  }
  
  try {
    // Get Figma context
    const figmaContext = await getFigmaContextData();
    
    const payload = {
      ...debtData,
      project_id: projectId,
      logged_by: userData.full_name,
      figma_url: figmaContext.url,
      screen: debtData.screen || figmaContext.pageName,
    };
    
    const response = await fetch(`${config.apiBaseUrl}/rest/v1/ux_debts`, {
      method: 'POST',
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const debt = await response.json();
    
    figma.ui.postMessage({ 
      type: 'ux-debt-created', 
      success: true, 
      debt: Array.isArray(debt) ? debt[0] : debt
    });
  } catch (error) {
    console.error('Create UX debt error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debt-created', 
      success: false, 
      error: error.message || 'Failed to create UX debt'
    });
  }
}

async function updateUXDebt(projectId: string, debtId: string, debtData: any) {
  if (!apiKey || !userData || !config) {
    figma.ui.postMessage({ 
      type: 'ux-debt-updated', 
      success: false, 
      error: 'Not authenticated' 
    });
    return;
  }
  
  try {
    const response = await fetch(`${config.apiBaseUrl}/rest/v1/ux_debts?id=eq.${debtId}`, {
      method: 'PATCH',
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(debtData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    const debt = await response.json();
    
    figma.ui.postMessage({ 
      type: 'ux-debt-updated', 
      success: true, 
      debt: Array.isArray(debt) ? debt[0] : debt
    });
  } catch (error) {
    console.error('Update UX debt error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debt-updated', 
      success: false, 
      error: error.message || 'Failed to update UX debt'
    });
  }
}

async function deleteUXDebt(projectId: string, debtId: string) {
  if (!apiKey || !config) {
    figma.ui.postMessage({ 
      type: 'ux-debt-deleted', 
      success: false, 
      error: 'Not authenticated' 
    });
    return;
  }
  
  try {
    const response = await fetch(`${config.apiBaseUrl}/rest/v1/ux_debts?id=eq.${debtId}`, {
      method: 'DELETE',
      headers: {
        'apikey': config.anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    figma.ui.postMessage({ 
      type: 'ux-debt-deleted', 
      success: true
    });
  } catch (error) {
    console.error('Delete UX debt error:', error);
    figma.ui.postMessage({ 
      type: 'ux-debt-deleted', 
      success: false, 
      error: error.message || 'Failed to delete UX debt'
    });
  }
}

async function getFigmaContext() {
  const context = await getFigmaContextData();
  figma.ui.postMessage({ 
    type: 'figma-context', 
    context 
  });
}

async function getFigmaContextData() {
  try {
    const selection = figma.currentPage.selection;
    const pageName = figma.currentPage.name;
    const fileName = figma.root.name;
    
    // Generate Figma URL
    let url = `https://www.figma.com/file/${figma.fileKey}/${encodeURIComponent(fileName)}`;
    
    if (selection.length > 0) {
      const nodeId = selection[0].id;
      url += `?node-id=${encodeURIComponent(nodeId)}`;
    }
    
    return {
      url,
      pageName,
      fileName,
      selectedNodes: selection.length,
      selectedNodeNames: selection.map(node => node.name)
    };
  } catch (error) {
    console.error('Error getting Figma context:', error);
    return {
      url: 'https://www.figma.com',
      pageName: 'Unknown',
      fileName: 'Unknown',
      selectedNodes: 0,
      selectedNodeNames: []
    };
  }
}