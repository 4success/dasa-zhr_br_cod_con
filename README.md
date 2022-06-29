Para usar essa image, execute o seguinte comando:

 * `docker build -t sapui5-nginx:latest .`
 * `docker run -d --name sapui5-nginx-dasa-vt -p 80:80  -v /caminho/para/root/do/projeto:/var/www sapui5-nginx:latest`

Como usar a autentação do Portal:
 1) Faça login no SuccessFactors
 2) Faça proxy no usuário desejado
 3) Após o proxy, abra a URL `https://saphcmqas.dasa.com.br:44300/sap/opu/odata/SAP/ZCL_HR_BR_REPORTS_UI5_GW_SRV/$metadata`
 4) Abre as ferramentas de desenvolvedor do navegador (F12 no Google Chrome)
 5) Vá na aba Application, depois na pasta de Cookies
 6) Copie o Cookie SAP_SESSIONID_QAS_200 para o seu domínio localhost
 
 Feitos os passos acima, a aplicação deve autenticar conforme proxy.
