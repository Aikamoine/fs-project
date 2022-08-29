/* eslint-disable react/no-unescaped-entities */
import React from 'react'

const Instructions = () => (
  <div>
    +-napista saat lisättyä uuden tunnisteen
    <br />
    Anna lisätylle tunnisteelle nimi ja määritä onko se ruoka-annos ennen tallentamista.
    <br />
    <br />
    Ruoka-annos määrittää lasketaanko tunnisteen sisältävä resepti ostoslistan resepteissä ruoka-annosten vai muiden annoksien joukkoon.
    <br />
    Tämän menettelyn on tarkoitus helpottaa ostoslistan sisältävien annosten laskentaa.
    <br />
    <br />
    Jos jokin resepti sisältää yhdenkin tunnisteen, jonka Ruoka-annos -arvo on "Ei", niin resepti tulkitaan muuksi kuin ruoka-annokseksi.
    <br />
    Esimerkiksi tunnisteet "g-muok", "jälkiruoka" ja "pähkinä" sisältävä resepti ei ole ruoka-annos, koska se sisältää tunnisteen "jälkiruoka".
  </div>
)

export default Instructions
