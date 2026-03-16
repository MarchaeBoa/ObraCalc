/*
 * ══════════════════════════════════════════════════════════════
 *  CalcObra Pro — Google Apps Script para envio de e-mail
 * ══════════════════════════════════════════════════════════════
 *
 *  COMO CONFIGURAR (2 minutos):
 *
 *  1. Acesse: https://script.google.com/
 *  2. Clique em "+ Novo Projeto"
 *  3. Apague todo o conteudo e cole ESTE ARQUIVO INTEIRO
 *  4. Clique em "Implantar" > "Nova implantacao"
 *  5. Em "Tipo", selecione "App da Web"
 *  6. Em "Executar como", selecione "Eu" (sua conta Google)
 *  7. Em "Quem tem acesso", selecione "Qualquer pessoa"
 *  8. Clique em "Implantar"
 *  9. Autorize o acesso ao Gmail quando solicitado
 * 10. Copie a URL gerada e cole no arquivo calcobra-ultra.html
 *     na variavel APPS_SCRIPT_URL (procure por "APPS_SCRIPT_URL")
 *
 * ══════════════════════════════════════════════════════════════
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var email = data.email;
    var name  = data.name;
    var code  = data.code;

    var subject = 'CalcObra — Codigo de Verificacao: ' + code;

    var textBody = 'Ola ' + name + ',\n\n' +
      'Seu codigo de verificacao CalcObra e: ' + code + '\n\n' +
      'Este codigo expira em 10 minutos.\n' +
      'Se voce nao solicitou este codigo, ignore este e-mail.\n\n' +
      '— Equipe CalcObra Pro\n' +
      'Prosperar Group LTDA';

    var htmlBody = '' +
      '<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;background:#040404;border-radius:16px;overflow:hidden;border:1px solid rgba(201,152,42,0.2)">' +
        '<div style="background:linear-gradient(135deg,#0e0e0e,#141414);padding:32px 28px;text-align:center;border-bottom:1px solid rgba(201,152,42,0.15)">' +
          '<div style="display:inline-block;width:40px;height:40px;background:linear-gradient(135deg,#C9982A,#F8DC82);border-radius:10px;line-height:40px;font-size:20px;margin-bottom:12px">&#x2B21;</div>' +
          '<h1 style="color:#F2EDE4;font-size:22px;margin:0;font-weight:700;letter-spacing:-0.5px">CalcObra Pro</h1>' +
        '</div>' +
        '<div style="padding:32px 28px;text-align:center">' +
          '<p style="color:#B0A890;font-size:14px;margin:0 0 8px">Ola, <strong style="color:#F2EDE4">' + name + '</strong></p>' +
          '<p style="color:#B0A890;font-size:14px;margin:0 0 24px">Use o codigo abaixo para verificar sua conta:</p>' +
          '<div style="background:#0e0e0e;border:2px solid rgba(201,152,42,0.3);border-radius:12px;padding:20px;margin:0 auto 24px;display:inline-block">' +
            '<span style="font-family:monospace;font-size:36px;font-weight:900;letter-spacing:8px;color:#F8DC82">' + code + '</span>' +
          '</div>' +
          '<p style="color:#706850;font-size:12px;margin:0">Este codigo expira em <strong>10 minutos</strong></p>' +
        '</div>' +
        '<div style="background:#080808;padding:20px 28px;text-align:center;border-top:1px solid rgba(255,255,255,0.05)">' +
          '<p style="color:#504838;font-size:11px;margin:0">Se voce nao solicitou este codigo, ignore este e-mail.</p>' +
          '<p style="color:#504838;font-size:10px;margin:8px 0 0">Prosperar Group LTDA &bull; CNPJ 46.343.841/0001-00</p>' +
        '</div>' +
      '</div>';

    GmailApp.sendEmail(email, subject, textBody, {
      htmlBody: htmlBody,
      name: 'CalcObra Pro'
    });

    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* Permite teste via GET (abrir URL no navegador) */
function doGet() {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    service: 'CalcObra Email Verification',
    message: 'Use POST para enviar emails.'
  })).setMimeType(ContentService.MimeType.JSON);
}
