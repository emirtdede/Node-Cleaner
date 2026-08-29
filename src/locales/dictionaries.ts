import { SupportedLanguage } from "@/types";
import { TranslationSchema } from "./types";

export type { TranslationSchema };

import tr from "./langs/tr";
import en from "./langs/en";
import de from "./langs/de";
import es from "./langs/es";
import fr from "./langs/fr";
import it from "./langs/it";
import pt from "./langs/pt";
import nl from "./langs/nl";
import sv from "./langs/sv";
import da from "./langs/da";
import fi from "./langs/fi";
import no from "./langs/no";
import is from "./langs/is";
import ca from "./langs/ca";
import eu from "./langs/eu";
import gl from "./langs/gl";
import ga from "./langs/ga";
import pl from "./langs/pl";
import ru from "./langs/ru";
import uk from "./langs/uk";
import el from "./langs/el";
import cs from "./langs/cs";
import hu from "./langs/hu";
import ro from "./langs/ro";
import bg from "./langs/bg";
import sk from "./langs/sk";
import hr from "./langs/hr";
import et from "./langs/et";
import lt from "./langs/lt";
import lv from "./langs/lv";
import sr from "./langs/sr";
import sl from "./langs/sl";
import bs from "./langs/bs";
import sq from "./langs/sq";
import mk from "./langs/mk";
import ja from "./langs/ja";
import ko from "./langs/ko";
import zh from "./langs/zh";
import zh_tw from "./langs/zh-tw";
import id from "./langs/id";
import vi from "./langs/vi";
import th from "./langs/th";
import ms from "./langs/ms";
import fil from "./langs/fil";
import my from "./langs/my";
import km from "./langs/km";
import si from "./langs/si";
import ar from "./langs/ar";
import hi from "./langs/hi";
import bn from "./langs/bn";
import he from "./langs/he";
import fa from "./langs/fa";
import ur from "./langs/ur";
import az from "./langs/az";
import kk from "./langs/kk";
import uz from "./langs/uz";
import ta from "./langs/ta";
import te from "./langs/te";
import mr from "./langs/mr";
import kn from "./langs/kn";
import gu from "./langs/gu";
import ml from "./langs/ml";
import pa from "./langs/pa";
import ka from "./langs/ka";
import hy from "./langs/hy";
import ky from "./langs/ky";
import tk from "./langs/tk";
import mn from "./langs/mn";
import sw from "./langs/sw";
import am from "./langs/am";
import ha from "./langs/ha";
import yo from "./langs/yo";
import af from "./langs/af";

export const DICTIONARIES: Record<SupportedLanguage, TranslationSchema> = {
  "tr": tr,
  "en": en,
  "de": de,
  "es": es,
  "fr": fr,
  "it": it,
  "pt": pt,
  "nl": nl,
  "sv": sv,
  "da": da,
  "fi": fi,
  "no": no,
  "is": is,
  "ca": ca,
  "eu": eu,
  "gl": gl,
  "ga": ga,
  "pl": pl,
  "ru": ru,
  "uk": uk,
  "el": el,
  "cs": cs,
  "hu": hu,
  "ro": ro,
  "bg": bg,
  "sk": sk,
  "hr": hr,
  "et": et,
  "lt": lt,
  "lv": lv,
  "sr": sr,
  "sl": sl,
  "bs": bs,
  "sq": sq,
  "mk": mk,
  "ja": ja,
  "ko": ko,
  "zh": zh,
  "zh-tw": zh_tw,
  "id": id,
  "vi": vi,
  "th": th,
  "ms": ms,
  "fil": fil,
  "my": my,
  "km": km,
  "si": si,
  "ar": ar,
  "hi": hi,
  "bn": bn,
  "he": he,
  "fa": fa,
  "ur": ur,
  "az": az,
  "kk": kk,
  "uz": uz,
  "ta": ta,
  "te": te,
  "mr": mr,
  "kn": kn,
  "gu": gu,
  "ml": ml,
  "pa": pa,
  "ka": ka,
  "hy": hy,
  "ky": ky,
  "tk": tk,
  "mn": mn,
  "sw": sw,
  "am": am,
  "ha": ha,
  "yo": yo,
  "af": af,
};
