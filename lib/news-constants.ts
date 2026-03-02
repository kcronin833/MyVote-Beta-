// Political news filtering and scoring constants
// Extracted to a separate module to reduce webpack cache serialization overhead

export const STOP_WORDS = new Set([
  "the","a","an","and","or","but","in","on","at","to","for","of","with","by",
  "from","as","is","was","are","were","been","be","have","has","had","do",
  "does","did","will","would","could","should","may","might","shall","can",
  "its","it","that","this","than","he","she","they","his","her","their",
  "our","we","you","your","my","says","said","new","also","about","after",
  "over","into","more","how","what","when","who","why","not","just","some",
])

const POLITICAL_TERMS = [
  "congress","senate","senator","house","representative",
  "republican","democrat","gop","liberal","conservative",
  "biden","trump","white\\s?house","president","governor","mayor",
  "legislation","bill\\b","law","policy","vote","elect","campaign",
  "partisan","bipartisan","supreme\\s?court","scotus","justice",
  "attorney\\s?general","fbi","doj","cia","pentagon","cabinet",
  "impeach","executive\\s?order","veto","filibuster","lobby",
  "gerrymander","redistrict","stimulus","debt\\s?ceiling","shutdown",
  "appropriat","federal","government","administration",
  "political","politics","immigration","border","asylum",
  "abortion","gun\\s?control","second\\s?amendment","first\\s?amendment",
  "nato","diplomacy","sanction","tariff","trade\\s?war","foreign\\s?policy",
  "state\\s?of\\s?the\\s?union","midterm","primary","caucus","poll",
  "approval\\s?rating","executive\\s?branch","judicial","legislative",
]

export const POLITICAL_KEYWORDS = new RegExp(
  `\\b(${POLITICAL_TERMS.join("|")})\\b`, "i"
)

const HOT_BUTTON_TERMS = [
  "abortion","gun\\s?control","immigration","impeach","indictment",
  "classified","scandal","investigation","probe","subpoena","contempt",
  "riot","insurrection","protest","ban","overturn","strike\\s?down",
  "controversial","divisive","polariz","backlash","outrage",
  "clash","feud","slam","blast","attack","accus","alleg",
  "corrupt","fraud","misinformation","censorship","woke",
  "weaponiz","radical","extremis",
]

export const HOT_BUTTON_KEYWORDS = new RegExp(
  `\\b(${HOT_BUTTON_TERMS.join("|")})\\b`, "i"
)

export const LEFT_DOMAINS =
  "huffpost.com,msnbc.com,cnn.com,nytimes.com,washingtonpost.com,vox.com,thenation.com,motherjones.com,slate.com"

export const RIGHT_DOMAINS =
  "foxnews.com,dailywire.com,breitbart.com,washingtontimes.com,nationalreview.com,nypost.com,dailycaller.com,thefederalist.com"
