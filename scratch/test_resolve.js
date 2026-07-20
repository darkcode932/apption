const path = require('path');
const fs = require('fs');

const srcDir = path.resolve(__dirname, '../src');

const files = [
  { file: 'app/(auth)/forgot-password/page.tsx', path: '../../../i18n/LanguageContext' },
  { file: 'app/(auth)/login/page.tsx', path: '../../../i18n/LanguageContext' },
  { file: 'app/(auth)/register/page.tsx', path: '../../../i18n/LanguageContext' },
  { file: 'app/(authenticated)/dashboard/page.tsx', path: '../../../i18n/LanguageContext' },
  { file: 'app/(authenticated)/home/page.tsx', path: '../../../i18n/LanguageContext' },
  { file: 'app/(authenticated)/launch-petition/page.tsx', path: '../../../i18n/LanguageContext' },
  { file: 'app/admin/dashboard/page.tsx', path: '../../../i18n/LanguageContext' },
  { file: 'app/admin/layout.tsx', path: '../../i18n/LanguageContext' },
  { file: 'app/admin/petitions/page.tsx', path: '../../../i18n/LanguageContext' },
  { file: 'app/admin/users/page.tsx', path: '../../../i18n/LanguageContext' },
  { file: 'app/components/Footer.tsx', path: '../../i18n/LanguageContext' },
  { file: 'app/components/HomePet.tsx', path: '../../i18n/LanguageContext' },
  { file: 'app/components/Navbar.tsx', path: '../../i18n/LanguageContext' },
  { file: 'app/components/PetBotWidget.tsx', path: '../../i18n/LanguageContext' },
  { file: 'app/components/PetItem.tsx', path: '../../i18n/LanguageContext' },
  { file: 'app/components/PetStat.tsx', path: '../../i18n/LanguageContext' },
  { file: 'app/components/Profile.tsx', path: '../../i18n/LanguageContext' },
  { file: 'app/layout.tsx', path: '../i18n/LanguageContext' },
];

files.forEach(({ file, path: relPath }) => {
  const fullFile = path.resolve(srcDir, file);
  const fullTarget = path.resolve(path.dirname(fullFile), relPath);
  const exists = fs.existsSync(fullTarget + '.tsx');
  console.log(`${file} -> ${relPath} -> exists? ${exists}`);
});
