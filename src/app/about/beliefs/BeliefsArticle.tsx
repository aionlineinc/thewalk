"use client";

import Link from "next/link";
import { ScriptureEnhance } from "@/components/scripture/ScriptureEnhance";
import { SupportingScripturesLine } from "@/components/scripture/ScriptureSupportLine";

const navItems = [
  { id: "father", label: "Father" },
  { id: "the-son", label: "The Son" },
  { id: "holy-spirit", label: "Holy Spirit" },
  { id: "members", label: "Members" },
] as const;

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4 text-[15px] font-light leading-relaxed text-muted-foreground">{children}</div>
  );
}

export function BeliefsArticle() {
  return (
    <article className="bg-background pb-24 pt-28 md:pb-32 md:pt-36">
      <div className="container mx-auto max-w-3xl px-4">
        <nav aria-label="Breadcrumb" className="mb-10">
          <Link
            href="/about"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-earth-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-earth-900"
          >
            ← Back to About
          </Link>
        </nav>

        <header className="mb-12">
          <h1 className="text-3xl font-normal tracking-tight text-earth-900 md:text-4xl">Our Beliefs</h1>
        </header>

        <nav
          className="sticky top-24 z-10 -mx-4 mb-12 bg-background/95 px-4 py-3 backdrop-blur-sm md:top-28"
          aria-label="On this page"
        >
          <ul className="flex flex-wrap gap-2 md:gap-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="inline-flex rounded-full border border-earth-200 bg-white px-3 py-1.5 text-xs font-medium tracking-wide text-earth-900 transition-colors hover:border-earth-500 hover:bg-earth-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-earth-900 md:text-sm md:px-4 md:py-2"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ScriptureEnhance>
          <div className="space-y-20">
            <section
              id="father"
              className="scroll-mt-36 border-t border-earth-100 pt-14"
              aria-labelledby="beliefs-father-heading"
            >
              <h2 id="beliefs-father-heading" className="text-2xl font-normal text-earth-900">
                Father
              </h2>
              <h3 className="mt-2 text-sm font-medium uppercase tracking-widest text-earth-500">(GodHead)</h3>
              <Prose>
                <p className="mt-6">
                  In Him does the divine and perfect will of the Godhead reside and in Him, it has been
                  established, He is sovereign. His will is perfect and our primary focus and goal is to
                  ensure that as His vessels we seek to completely fulfil the will of the Father,
                  collectively and individually
                </p>
              </Prose>
              <SupportingScripturesLine references="Proverbs 3:6, Matthew 6:10, Proverbs 19:21, James 4:15" />
            </section>

            <section
              id="the-son"
              className="scroll-mt-36 border-t border-earth-100 pt-14"
              aria-labelledby="beliefs-son-heading"
            >
              <h2 id="beliefs-son-heading" className="text-2xl font-normal text-earth-900">
                The Son (Jesus Christ)
              </h2>
              <h3 className="mt-2 text-sm font-medium uppercase tracking-widest text-earth-500">(GodHead)</h3>
              <Prose>
                <p className="mt-6">
                  The Son of God is Jesus Christ, He is the manifestation of the will of the Father, and He
                  is the Lamb of God.
                </p>
                <p>
                  He was sacrificed so that all humanity could have the opportunity to be saved from the
                  damnation which is the result of sin. He Jesus Christ, the Word of God, came to the earth
                  as the Son of Man and was crucified. By His sacrifice, provision unto justification
                  concerning the judgment of the Father&apos;s decree, which states that &quot;the wages of sin
                  is death&quot;, was satisfied. For all those who accept Jesus&apos; sacrifice by faith, they
                  are saved by this gracious act of God, the Father, through the Son.
                </p>
                <p>
                  We believe that the Son of God came to earth, lived a life without sin and was therefore
                  not worthy of death, He chose to die in exchange for humanity, in effect giving His
                  righteousness and perfect life/spirit to us while taking on our broken lives. In faith, we
                  continue to live His life today, through the Holy Spirit.
                </p>
                <p>
                  Jesus is now our Lord, He is the Word of God in all His manifested forms in body as the
                  Christ, in Logos via the Scriptures and in Rhema through prophetic utterance. We believe
                  that the Logos Word and Rhema Word are authoritative as long as they agree and in no way
                  conflict with each other, because we believe that the God we serve is unchanging as He
                  claims, then the Logos Word remains and is unchangeable.
                </p>
              </Prose>
              <SupportingScripturesLine references="Matthew 3:17, Matthew 17:5, John 5:19, John 5:30, John 3:16, John 1:1" />
            </section>

            <section
              id="holy-spirit"
              className="scroll-mt-36 border-t border-earth-100 pt-14"
              aria-labelledby="beliefs-spirit-heading"
            >
              <h2 id="beliefs-spirit-heading" className="text-2xl font-normal text-earth-900">
                The Holy Spirit
              </h2>
              <h3 className="mt-2 text-sm font-medium uppercase tracking-widest text-earth-500">(GodHead)</h3>
              <Prose>
                <p className="mt-6">
                  The Holy Spirit is one with God the Father and the Son (the Word of God), they have, do
                  and will always agree. He is the very presence of God with humanity now that the Son of
                  God doesn&apos;t presently walk in the flesh within the earth. The Holy Spirit is the means
                  by which everything truly Godly is made possible in and through mankind, it is through the
                  Holy Spirit that man is made to know the righteous standard of God, it is this conviction
                  of sin that draws humanity to seek God&apos;s righteousness.
                </p>
                <p>
                  When we accept Jesus Christ as Lord and Savior acknowledging our sin and the price paid for
                  it, the Holy Spirit comes and dwells within us, bringing with Him all that is God, i.e.
                  His dwelling within us makes us tabernacles for God. We by the Holy Spirit dwelling within
                  us are provided with a Helper, Comforter and Guide that is always present, by this
                  Jesus&apos; words &quot;I will never leave you or forsake you&quot;, is fulfilled. When the
                  Holy Spirit is embraced by the believer and is trusted and followed the fruit of the
                  Spirit are cultivated, these are love, joy, peace, patience, kindness, goodness,
                  faithfulness, gentleness and self-control. It is this fruit that makes us strong in the
                  Lord.
                </p>
                <p>
                  The same power and authority that Jesus the Son of Man walked in, through the Holy Spirit
                  we too walk in this very power and authority, when we fully realise all that we are in
                  Christ. It is through the Spirit of God that we know the will of the Father and can apply
                  the Word of God and therefore function effectively as Ambassadors to His Kingdom. The Holy
                  Spirit supports the work given by the Word of God in the creation of disciples of Christ
                  and the spreading of the Gospel of the Kingdom of God. He does this by empowering the
                  testimony of those sent out with the manifestation of the knowledge, works and power of
                  the Kingdom of God to which the gospel testifies, displaying clearly that the Kingdom of
                  God is undoubtedly at hand.
                </p>
              </Prose>
              <SupportingScripturesLine references="John 16:7-11, John 14:16, 1 Corinthians 3:16, Romans 8:9, John 16:14, 2 Corinthians 6:16, Deuteronomy 31:6, 1 Corinthians 6:19-20, John 16:13, John 15:26, 1 Corinthians 12:3, Galatians 5:22-23, 1 Corinthians 12:1-31" />
            </section>

            <section
              id="members"
              className="scroll-mt-36 border-t border-earth-100 pt-14"
              aria-labelledby="beliefs-members-heading"
            >
              <h2 id="beliefs-members-heading" className="text-2xl font-normal text-earth-900">
                Members
              </h2>
              <h3 className="mt-2 text-sm font-medium uppercase tracking-widest text-earth-500">
                (Children of God)
              </h3>

              <div className="mt-10 space-y-12">
                <div>
                  <h4 className="text-lg font-medium text-earth-900">Importance of Structure</h4>
                  <Prose>
                    <p className="mt-4">
                      While we believe that structure and hierarchy are fundamental we also believe that the
                      structure of an organism should be based on the purpose of the organism. Our focus and
                      structure therefore at all times will be based on our community (the Kingdom of God,
                      and its King) and our purpose within the wider community the ecclesia, as it relates to
                      the specific mandates given to theWalk.
                    </p>
                  </Prose>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-earth-900">Importance of Diversity and Unity</h4>
                  <Prose>
                    <p className="mt-4">
                      We believe that just as the health of a natural body is dependent on all components of
                      that body being well-nourished, communicating and functioning well together, then
                      also, there is need for us as the Body of Christ to be all well-nourished and
                      communicating purposefully so we also can be healthier in our collective purpose.
                    </p>
                    <p>
                      Further, we believe that only in the presence and service of another can the true value
                      of our uniqueness, purpose and ultimately, our fulfilment be realised. We therefore
                      encourage collaboration at all levels for growth so that connectivity and strength of
                      the community can be enhanced.
                    </p>
                  </Prose>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-earth-900">New Converts</h4>
                  <Prose>
                    <p className="mt-4">
                      Children are not able to vote, work, or contribute in many ways that adults do to
                      society, yet in most cultures and in many aspects they are the ones most loved and
                      cherished, this often makes those who are most vulnerable the ones most valued (
                      Matthew 18:6). The new, the young and the unshaped are vital aspects to any organism as
                      these are able to change beyond the taught limits of its established environment; we
                      believe that all members of this ministry are essential to the success of the ministry
                      and openly welcome and accept all opinions for discussion. It is not possible to journey
                      through extreme terrain with small children without there being inherent dangers as a
                      result of the journey itself but it is difficult to travel through any terrain with
                      those who have not travelled that way before and not learn something new from the
                      questions they present that you yourself haven&apos;t thought to ask. So it is our goal
                      that as much as is possible we grow together as we believe that true learning requires
                      that established perceptions and world views are discussed so we can learn from each
                      our individual angles of perception. We will not be hindering the voices of the
                      members of our community and welcome all respectable expression so that the Word of
                      God can be expressed in its full clarity to them and us.
                    </p>
                  </Prose>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-earth-900">Leaders</h4>
                  <Prose>
                    <p className="mt-4">
                      Those who will be elevated in this community to maintain structure and give guidance by
                      the leading of the Holy Spirit due to their relationship with the King and their
                      willingness to be open to Him for this cause will be servant leaders, leaders for the
                      purpose of servitude. This servitude is expressed first and primarily to the King and
                      secondly without deviation to the community and all that pertains to it. There will be
                      no assigning of titles within the community outside of for the purpose for determining
                      of roles unique to this ministry, and these will be deliberately kept distinct from
                      biblical titles, as we do not intend to create a super church but rather a community
                      for the gathering of churches. We endeavour to maintain a relaxed family atmosphere as
                      much as is possible and to promote respect at all levels. While we will not enforce the
                      absolute use of titles or issue any Biblical titles within our community, the titles of
                      members from their respected ministries should be observed and respected, and the roles
                      of those within the community should be adhered to as much as is required for structure
                      and organization.
                    </p>
                    <p>
                      We believe that being set apart by God to be an Apostle, Prophet, Evangelist, Pastor or
                      Teacher to the Body of Christ is inherent from Him and comes from above and not from
                      men or self, respect is to be shown to all those who sit in authoritative positions
                      within the body of Christ because they have been chosen by Him and to all those who do
                      not have these five fold titles because they too are a part of Him. We will enforce
                      respect through grace for all members of the community.
                    </p>
                    <p>
                      We define respect as that which God revealed through the 10 commandments and we define
                      grace to be that which has the capacity to go above these statutes through the Spirit of
                      God and seek peace not through justice alone but to seek peace, through mercy and
                      forgiveness as well.
                    </p>
                  </Prose>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-earth-900">Unification of Ministries</h4>
                  <Prose>
                    <p className="mt-4">
                      We fully expect to draw upon the collective and individual strengths of ministries,
                      ministers and members of all those who will walk with us, to assist in our collective
                      endeavours, as we may make requests of the anointing and gifted them for the Body of
                      Christ.
                    </p>
                    <p>
                      A system for a servant leadership <a href="/about/ministry-structure">Ministry Structure</a> has been given which embodies the
                      ideals we see in scripture and it is these we will endeavour to establish our community
                      upon.
                    </p>
                  </Prose>
                </div>
              </div>

              <SupportingScripturesLine references="Matthew 5:3-10, Matthew 18:6, Mark 10:43, John 13:1-17, Luke 22:25-26, John 7:18, Ephesians 6:6, Psalms 15:1-5, Matthew 20:26, Matthew 20:28, 1 Corinthians 9:19, 1 Corinthians 12:12-26, John 3:27-30" />
            </section>
          </div>
        </ScriptureEnhance>
      </div>
    </article>
  );
}
