import { createMCPClient } from '@ai-sdk/mcp';
import { getToken } from '@vercel/connect';
import { ConsentRequiredError } from '@vercel/connect/ai-sdk';

export async function GET() {
  try {
    const token = await getToken('scl_Sldu7yLu3itNludDDYNHg', {
      subject: { type: 'user', id: 'test_user_1' },
    });

    const cookieyes = await createMCPClient({
      transport: {
        type: 'http',
        url: 'https://app.cookieyes.com/mcp',
        headers: { Authorization: `Bearer ${token}` },
      },
    });

    try {
      const tools = await cookieyes.tools();
      return Response.json({ toolCount: Object.keys(tools).length });
    } finally {
      await cookieyes.close();
    }
  } catch (error) {
    if (
      error instanceof ConsentRequiredError ||
      error?.name === 'ConsentRequiredError'
    ) {
      return Response.redirect(error.url);
    }
        return Response.json(
      { error: error?.name, message: error?.message },
      { status: 500 }
    );
  }
}
