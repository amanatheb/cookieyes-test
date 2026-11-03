import { createMCPClient } from '@ai-sdk/mcp';
import {
  connectAuthProvider,
  ConsentRequiredError,
} from '@vercel/connect/ai-sdk';

export async function GET() {
  try {
    const cookieyes = await createMCPClient({
      transport: {
        type: 'http',
        url: 'https://app.cookieyes.com/mcp',
        authProvider: connectAuthProvider('scl_Sldu7yLu3itNludDDYNHg
', {
          subject: { type: 'user', id: 'test_user_1' },
        }),
      },
    });

    try {
      const tools = await cookieyes.tools();
      return Response.json({ toolCount: Object.keys(tools).length });
    } finally {
      await cookieyes.close();
    }
  } catch (error) {
    if (error instanceof ConsentRequiredError) {
      return Response.redirect(error.url);
    }
    throw error;
  }
}
