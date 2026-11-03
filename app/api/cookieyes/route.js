import { createMCPClient } from '@ai-sdk/mcp';
import {
  getToken,
  startAuthorization,
  UserAuthorizationRequiredError,
} from '@vercel/connect';

const connector = 'scl_Sldu7yLu3itNludDDYNHg';
const subject = { type: 'user', id: 'test_user_1' };

export async function GET() {
  try {
    const token = await getToken(connector, { subject });

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
    if (error instanceof UserAuthorizationRequiredError) {
      const { url } = await startAuthorization(connector, { subject });
      return Response.redirect(url);
    }
    return Response.json(
      { error: error?.name, message: error?.message },
      { status: 500 }
    );
  }
}
