import crypto from 'crypto';

// Função para descriptografar a resposta da API
function descriptografar(encryptedBase64: string): any {
  const chave = Buffer.from(process.env.API_ENCRYPTION_KEY as string, 'hex');
  const dados = Buffer.from(encryptedBase64, 'base64');
  const iv = dados.subarray(0, 12);
  const authTag = dados.subarray(12, 28);
  const textoCriptografado = dados.subarray(28);

  const decipher = crypto.createDecipheriv('aes-256-gcm', chave, iv);
  decipher.setAuthTag(authTag);

  const textoFinal = Buffer.concat([
    decipher.update(textoCriptografado),
    decipher.final()
  ]);

  return JSON.parse(textoFinal.toString('utf8'));
}

// Função principal para buscar dados na API WyzBots de forma segura
export async function buscarDadosNaWyzBots(endpoint: string) {
  // Faz o request enviando o Header Secreto
  const resposta = await fetch(`http://82.24.40.2${endpoint}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.API_AUTH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 30 } // Cache do Next.js
  });

  const jsonBruto = await resposta.json();

  // Se o servidor retornou erro de bloqueio
  if (!jsonBruto.success && jsonBruto.error === 'Calma espertinho') {
    throw new Error('Acesso negado pela API principal');
  }

  // Descriptografa se o conteúdo vier criptografado
  if (jsonBruto.isEncrypted && jsonBruto.payload) {
    return descriptografar(jsonBruto.payload);
  }

  return jsonBruto;
}
