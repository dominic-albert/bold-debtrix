// Figma plugin main code
figma.showUI(__html__, { 
  width: 400, 
  height: 600,
  themeColors: true 
});

// Store API key and user data
let apiKey: string | null = null;
let userData: any = null;
let apiBaseUrl: string = '';
let anonKey: string = '';

// Load stored API key on startup
figma.clientStorage.getAsync('debtrix_api_key').then((storedKey) => {
  if (storedKey) {
    apiKey = storedKey;
    figma.ui.postMessage({ type: 'api-key-loaded', apiKey: storedKey });
  }
});

// Listen for messages from UI
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'verify-api-key':
      apiBaseUrl = msg.apiBaseUrl;
      anonKey = msg.anonKey;
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
};

async function verifyApiKey(key: string) {
  try {
    const response = await fetch(`${apiBaseUrl}/rest/v1/profiles?select=id,email,full_name`, {
      headers: {
        'apikey': anonKey,
        'x-api-key': key,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Invalid API key');
    }
    
    const data = await response.json();
    if (data.length === 0) {
      throw new Error('Invalid API key');
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
    figma.ui.postMessage({ 
      type: 'api-key-verified', 
      success: false, 
      error: error.message 
    });
  }
}

async function getProjects() {
  if (!apiKey || !userData) {
    figma.ui.postMessage({ 
      type: 'projects-loaded', 
      success: false, 
      error: 'Not authenticated' 
    });
    return;
  }
  
  try {
    const response = await fetch(`${apiBaseUrl}/rest/v1/projects?owner_id=eq.${userData.id}&select=id,title,description,color,created_at,updated_at&order=updated_at.desc`, {
      headers: {
        'apikey': anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    
    const projects = await response.json();
    
    figma.ui.postMessage({ 
      type: 'projects-loaded', 
      success: true, 
      projects 
    });
  } catch (error) {
    figma.ui.postMessage({ 
      type: 'projects-loaded', 
      success: false, 
      error: error.message 
    });
  }
}

async function getUXDebts(projectId: string) {
  if (!apiKey) {
    figma.ui.postMessage({ 
      type: 'ux-debts-loaded', 
      success: false, 
      error: 'Not authenticated' 
    });
    return;
  }
  
  try {
    const response = await fetch(`${apiBaseUrl}/rest/v1/ux_debts?project_id=eq.${projectId}&select=*&order=created_at.desc`, {
      headers: {
        'apikey': anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch UX debts');
    }
    
    const debts = await response.json();
    
    figma.ui.postMessage({ 
      type: 'ux-debts-loaded', 
      success: true, 
      debts 
    });
  } catch (error) {
    figma.ui.postMessage({ 
      type: 'ux-debts-loaded', 
      success: false, 
      error: error.message 
    });
  }
}

async function createUXDebt(projectId: string, debtData: any) {
  if (!apiKey || !userData) {
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
    
    const response = await fetch(`${apiBaseUrl}/rest/v1/ux_debts`, {
      method: 'POST',
      headers: {
        'apikey': anonKey,
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create UX debt: ${errorText}`);
    }
    
    const debt = await response.json();
    
    figma.ui.postMessage({ 
      type: 'ux-debt-created', 
      success: true, 
      debt: debt[0] 
    });
  } catch (error) {
    figma.ui.postMessage({ 
      type: 'ux-debt-created', 
      success: false, 
      error: error.message 
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
}