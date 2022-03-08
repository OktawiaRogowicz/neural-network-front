import { useTranslation } from "react-i18next";

export const listOfCategoriesEn = ['cookie', 'smartphone', 'carrot', 'broccoli', 'floor lamp', 'grass', 'moon', 'mug', 'sword', 'sun']

export const useListOfCategories = () => {
    const { t } = useTranslation();
    return [t('cookie'), t('smartphone'), t('carrot'), t('broccoli'), t('floor_lamp'), t('grass'), t('moon'), t('mug'), t('sword'), t('sun')]
  }

// List in English is needed due to the way Cloudinary hosting works.

// I've chosen the names of categories in English to be Cloudinary folders' names,
// which means that if this part of communication with server gets translated,
// the pictures will be sent to a folder that doesn't exist and therefore lost in the process.