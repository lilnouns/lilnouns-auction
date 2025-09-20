import localFont from 'next/font/local'

const vazirmatn = localFont({
  display: 'swap',
  variable: '--font-vazirmatn',
  src: [
    { path: './Vazirmatn/Vazirmatn-Thin.ttf', weight: '100', style: 'normal' },
    {
      path: './Vazirmatn/Vazirmatn-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    { path: './Vazirmatn/Vazirmatn-Light.ttf', weight: '300', style: 'normal' },
    {
      path: './Vazirmatn/Vazirmatn-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: './Vazirmatn/Vazirmatn-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: './Vazirmatn/Vazirmatn-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    { path: './Vazirmatn/Vazirmatn-Bold.ttf', weight: '700', style: 'normal' },
    {
      path: './Vazirmatn/Vazirmatn-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    { path: './Vazirmatn/Vazirmatn-Black.ttf', weight: '900', style: 'normal' },
  ],
})

const firaCode = localFont({
  display: 'swap',
  variable: '--font-fira-code',
  src: [
    { path: './Fira_Code/FiraCode-Light.ttf', weight: '300', style: 'normal' },
    {
      path: './Fira_Code/FiraCode-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    { path: './Fira_Code/FiraCode-Medium.ttf', weight: '500', style: 'normal' },
    {
      path: './Fira_Code/FiraCode-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    { path: './Fira_Code/FiraCode-Bold.ttf', weight: '700', style: 'normal' },
  ],
})

const lora = localFont({
  display: 'swap',
  variable: '--font-lora',
  src: [
    { path: './Lora/Lora-Regular.ttf', weight: '400', style: 'normal' },
    { path: './Lora/Lora-Medium.ttf', weight: '500', style: 'normal' },
    { path: './Lora/Lora-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: './Lora/Lora-Bold.ttf', weight: '700', style: 'normal' },
    { path: './Lora/Lora-Italic.ttf', weight: '400', style: 'italic' },
    { path: './Lora/Lora-MediumItalic.ttf', weight: '500', style: 'italic' },
    { path: './Lora/Lora-SemiBoldItalic.ttf', weight: '600', style: 'italic' },
    { path: './Lora/Lora-BoldItalic.ttf', weight: '700', style: 'italic' },
  ],
})

const poppins = localFont({
  display: 'swap',
  variable: '--font-poppins',
  src: [
    { path: './Poppins/Poppins-Thin.ttf', weight: '100', style: 'normal' },
    {
      path: './Poppins/Poppins-ThinItalic.ttf',
      weight: '100',
      style: 'italic',
    },
    {
      path: './Poppins/Poppins-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: './Poppins/Poppins-ExtraLightItalic.ttf',
      weight: '200',
      style: 'italic',
    },
    { path: './Poppins/Poppins-Light.ttf', weight: '300', style: 'normal' },
    {
      path: './Poppins/Poppins-LightItalic.ttf',
      weight: '300',
      style: 'italic',
    },
    { path: './Poppins/Poppins-Regular.ttf', weight: '400', style: 'normal' },
    { path: './Poppins/Poppins-Italic.ttf', weight: '400', style: 'italic' },
    { path: './Poppins/Poppins-Medium.ttf', weight: '500', style: 'normal' },
    {
      path: './Poppins/Poppins-MediumItalic.ttf',
      weight: '500',
      style: 'italic',
    },
    {
      path: './Poppins/Poppins-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: './Poppins/Poppins-SemiBoldItalic.ttf',
      weight: '600',
      style: 'italic',
    },
    { path: './Poppins/Poppins-Bold.ttf', weight: '700', style: 'normal' },
    {
      path: './Poppins/Poppins-BoldItalic.ttf',
      weight: '700',
      style: 'italic',
    },
    {
      path: './Poppins/Poppins-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: './Poppins/Poppins-ExtraBoldItalic.ttf',
      weight: '800',
      style: 'italic',
    },
    { path: './Poppins/Poppins-Black.ttf', weight: '900', style: 'normal' },
    {
      path: './Poppins/Poppins-BlackItalic.ttf',
      weight: '900',
      style: 'italic',
    },
  ],
})

export { vazirmatn, firaCode, lora, poppins }
