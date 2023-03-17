import puppeteer, { Page } from "puppeteer";
import type { NextApiRequest, NextApiResponse } from 'next'



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const { ruc } = req.query as { ruc: string };// "20511315922";
  
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  const page = (await browser.pages())[0];

  
  await page.goto("https://e-consultaruc.sunat.gob.pe/cl-ti-itmrconsruc/FrameCriterioBusquedaWeb.jsp", {
    waitUntil: "domcontentloaded", args: ['--app']
  });


  await page.type('#txtRuc', ruc);
  await page.click('#btnAceptar');
  await page.waitForNavigation();


  let consultation = []

  /*
  const itemHeading = await page.$$eval('.col-sm-7 .list-group-item-heading', options => {
    return options.map(option => (option.textContent || "").trim().replace(/ /g,' ') ); 
  });

  const itemText = await page.$$eval('.list-group-item-text', options => {
    return options.map(option => (option.textContent || "").trim().replace(/ /g,' ') );
  });

  const activityEconomic = await page.$$eval('.tblResultado td', options => {
    return options.map(option => (option.textContent || "").trim().replace(/ /g,' ') );
  });
   */

  const itemHeading = await getListDataHeading(page);
  const itemText = await getListDataText(page);
  const activityEconomic = await getListDataActivityEconomic(page);

  consultation.push(...itemHeading, ...itemText, ...activityEconomic )


  await page.screenshot({ path: "screenshot.png" });
  await page.pdf({ path: "page.pdf" });

  await browser.close();

  res.status(200).json(consultation)
}


const getListDataHeading = async (page: Page) => {
  return await page.$$eval('.col-sm-7 .list-group-item-heading', options => {
    return options.map(option => (option.textContent || "").trim().replace(/ /g,' ') ); 
  });
}
const getListDataText = async (page: Page) => {
  return await page.$$eval('.list-group-item-text', options => {
    return options.map(option => (option.textContent || "").trim().replace(/ /g,' ') );
  });
}
const getListDataActivityEconomic = async (page: Page) => {
  return await page.$$eval('.tblResultado td', options => {
    return options.map(option => (option.textContent || "").trim().replace(/ /g,' ') );
  });
}




/*
itemHeading ==>  [
  'Número de RUC:',
  '20511315922 - REAL PLAZA S.R.L.',
  'Tipo Contribuyente:',
  'Nombre Comercial:',
  'Fecha de Inscripción:',
  'Fecha de Inicio de Actividades:',
  'Estado del Contribuyente:',
  'Condición del Contribuyente:',
  'Domicilio Fiscal:',
  'Sistema Emisión de Comprobante:',
  'Actividad Comercio Exterior:',
  'Sistema Contabilidad:',
  'Actividad(es) Económica(s):',
  'Comprobantes de Pago c/aut. de impresión (F. 806 u 816):',
  'Sistema de Emisión Electrónica:',
  'Emisor electrónico desde:',
  'Comprobantes Electrónicos:',
  'Afiliado al PLE desde:',
  'Padrones:'
]
itemText ==>  [
  'SOC.COM.RESPONS. LTDA',
  '-\n\t\t\t\t\t              \n\t\t\t\t\t            ',
  '05/08/2005',
  '01/09/2005',
  'ACTIVO\n' +
    '\t                         \t\n' +
    '\t\t\t\t\t                 \n' +
    '\t\t\t\t\t                \n' +
    '\t                         \t',
  '\n' +
    '\t\t                         \t\n' +
    '\t\t\t\t\t\t              \tHABIDO\n' +
    '\t\t\t\t\t\t              \n' +
    '\n' +
    '\t\t\t\t\t\t\t\t',
  'AV. PUNTA DEL ESTE NRO. 2403 (PUERTA 4 - PISO 2)  LIMA
      - LIMA                                                                                                                               - JESUS MARIA',
  'MANUAL/COMPUTARIZADO',
  'SIN ACTIVIDAD',
  'COMPUTARIZADO',
  '06/08/2015',
  'FACTURA (desde 06/08/2015),BOLETA (desde 06/08/2015)',
  '01/01/2013'
]
*/