export default function getCharacterInfo (characterInfo) {
        const textBoxEl = characterInfo

        // specified/prepping content ============
        let rQuote = textBoxEl.replace(/"/g, "")
        let rSAName = rQuote.replaceAll(/\|SA name/g, "\n|SA name").replaceAll(/\| SA name/g, "\n|SA name").replaceAll(/\|UltraSA name/g, "\n|UltraSA name").replaceAll(/\|UltraSA description/g, "\n|UltraSA description").replaceAll(/\|PS description/g, "\n|PS description").replaceAll(/\|24 ki/g, "\n|24 ki");

        let rPettan = rSAName.replace('|Pettan = yes', "")
        let rMoveASCond = rPettan.replace('|Active skill condition', '\n|Active skill condition').replace('|Active skill name', '\n|Active skill name')
        let rEqualSign = rMoveASCond.replace(/ =/g, ':')
        let rLineBreak = rEqualSign.replace('<br>', "").replace('</br>', "")

        let rServerIcon = rLineBreak.replaceAll(/File:Japan server.png\|20px|File:Global server.png\|20px|File:Card|File: Card /g, "")

        let rExtraCatInLink = rServerIcon.replaceAll(/Androids-Cell Saga\||Kamehameha \(Category\)\||Otherworld Warriors \(Link Skill\)\||Turtle School \(Link Skill\)\||Namekians \(Link Skill\)\||Team Bardock \(Link Skill\)\||:Category:Extreme Class\||:Category:Super Class\||Fusion \(Link Skill\)\|/g, "");

        let rExtraDisambig = rExtraCatInLink.replaceAll(/Goku \(disambiguation\)\||Goku \(disambiguation\)#Goku\||Goku \(disambiguation\)#Goku \(Angel\)\||Goku \(disambiguation\)#Super Saiyan Goku\||Goku \(disambiguation\)#Goku \(Youth\)\||Caulifla \(disambiguation\)\||Cooler \(disambiguation\)\||Trunks \(disambiguation\)\||Bardock \(disambiguation\)\||Android 18 \(disambiguation\)\||Android 18 \(disambiguation\)#Android #18\||\(disambiguation\)#Ribrianne\||Rozie \(disambiguation\)\||Kakunsa \(disambiguation\)\||Kale \(disambiguation\)\||Tapion \(disambiguation\)\||Gohan \(disambiguation\)#Gohan \(Kid\)\||Frieza \(disambiguation\)\||Vegeta \(disambiguation\)\||Cooler \(disambiguation\)#Metal Cooler\||Giru \(disambiguation\)\||Cell \(disambiguation\)\||Boujack \(disambiguation\)\||Gohan \(disambiguation\)#Gohan \(Teen\)\||Gohan \(disambiguation\)#Ultimate Gohan\||Gohan \(disambiguation\)#Great Saiyaman\||Gohan \(disambiguation\)#Gohan \(Future\)\||Trunks \(disambiguation\)#Trunks \(Kid\)\||Trunks \(disambiguation\)#Trunks \(Teen\)\||Goten \(disambiguation\)#Goten \(Kid\)\||Goten \(disambiguation\)\,\||\(disambiguation\)\|Goten\||Piccolo \(disambiguation\)\||Piccolo \(disambiguation\)#Piccolo\||Cell \(disambiguation\)#Cell \(Perfect Form\)\||Cell \(disambiguation\)#Perfect Cell\||Gohan \(disambiguation\)#Super Saiyan Gohan \(Youth\)\||Gohan \(disambiguation\)#Super Saiyan 2 Gohan \(Youth\)\||Android 14 \(disambiguation\)#Androids #14 & #15\||Android 16 \(disambiguation\)\||Android 17 \(disambiguation\)#Android #17\||Android 17 \(disambiguation\)\|#17\||Android 18 \(disambiguation\)#Android #18 \(Future\)\||Android 17 \(disambiguation\)#Android #17 \(Future\)\||Ginyu \(disambiguation\)\||Android 13 \(disambiguation\)#Android #13\||Android 13 \(disambiguation\)#Fusion Android #13\||Zamasu \(disambiguation\)#Zamasu\||Zamasu \(disambiguation\)#Goku Black\||Trunks \(disambiguation\)#Trunks \(Teen\) \(Future\)\||Mai \(disambiguation\)#Mai \(Future\)\||Beerus \(disambiguation\)\||Krillin \(disambiguation\)#Krillin\||Krillin \(disambiguation\)\|Krillin\||Bulma \(disambiguation\)\||Bulma \(disambiguation\)#Bulma \(Youth\)\|/g, "");

        let rSphereFile = rExtraDisambig.replaceAll(/File:Rainbow icon.png\|30px\|link=|File:Rainbow icon.png\|30px|File:AGL icon.png\|30px\|link=Category:|File:AGL  icon.png\|30px\|link=Category:|File:TEQ icon.png\|30px\|link=Category:|File:INT icon.png\|30px\|link=Category:|File: INT icon.png\|30px\|link=Category:|File:STR icon.png\|30px\|link=Category:|File:PHY icon.png\|30px\|link=Category:|File: PHY icon.png\|30px\|link=Category:PHY/g, "")


        let rSSphereFile = rSphereFile.replace('File:SAGL icon.png|30px|link=Category:', "").replace('File:STEQ icon.png|30px|link=Category:', "").replace('File:SINT icon.png|30px|link=Category:', "").replace('File:SSTR icon.png|30px|link=Category:', "").replace('File:SPHY icon.png|30px|link=Category:', "").replace('([[:File:UR Giant Brianne Origin 1.png|origin]])','')

        let rESphereFile = rSSphereFile.replace('File:EAGL icon.png|30px|link=Category:', "").replace('File:ETEQ icon.png|30px|link=Category:', "").replace('File:EINT icon.png|30px|link=Category:', "").replace('File:ESTR icon.png|30px|link=Category:', "").replace('File:EPHY icon.png|30px|link=Category:', "")

        let rSphereExclude = rESphereFile.replace('icon.png|30px', "").replace(' thumb.png|120px','').replace(' thumb.png |120px','').replace(' thumb apng.png','').replace(' artwork apng.png','').replace('artwork apng.png','').replace(' artwork apng.webp','').replace('artwork apng.webp','')

        let rStackAtt = rSphereExclude.replace('([[Stack Attack|How does it work?]])', "").replace('Super Attack Multipliers|SA Multiplier', "super attack").replace('Lower ATK|','')

        let rName1 = rStackAtt.replace(/ name="\[1\]"/g, "").replace(/name=\[1\]/g, "").replace(/name": \[1\]/g, "").replace(/name":\[1\]/g, "")
        let rName2 = rName1.replace(/ name="\[2\]"/g, "").replace(/name=\[2\]/g, "").replace(/name": \[2\]/g, "").replace(/name":\[2\]/g, "")
        let rName3 = rName2.replace(/ name="\[3\]"/g, "").replace(/name=\[3\]/g, "").replace(/name": \[3\]/g, "").replace(/name":\[3\]/g, "")
        let rName4 = rName3.replace(/ name="\[4\]"/g, "").replace(/name=\[4\]/g, "").replace(/name": \[4\]/g, "").replace(/name":\[4\]/g, "")
        let rName5 = rName4.replace(/ name="\[5\]"/g, "").replace(/name=\[5\]/g, "").replace(/name": \[5\]/g, "").replace(/name":\[5\]/g, "")
        let rName6 = rName5.replace(/ name="\[6\]"/g, "").replace(/name=\[6\]/g, "").replace(/name": \[6\]/g, "").replace(/name":\[6\]/g, "")
        let rName7 = rName6.replace(/ name="\[7\]"/g, "").replace(/name=\[7\]/g, "").replace(/name": \[7\]/g, "").replace(/name":\[7\]/g, "")
        let rName8 = rName7.replace(/ name="\[8\]"/g, "").replace(/name=\[8\]/g, "").replace(/name": \[8\]/g, "").replace(/name":\[8\]/g, "")
        let rName9 = rName8.replace(/ name="\[9\]"/g, "").replace(/name=\[9\]/g, "").replace(/name": \[9\]/g, "").replace(/name":\[9\]/g, "")
        let rName10 = rName9.replace(/name=\[10\]/g, "").replace(/name=\[10\]/g, "").replace(/name": \[10\]/g, "").replace(/name":\[10\]/g, "")

        let rArrow = rName10.replace(/<!--/g,'').replace(/-->/g,'');
        let rSmall = rArrow.replace(/<small>/g,'').replace(/<\/small>/g,'');
        let rSpace = rSmall.replace(/\t/g,'');
        let rIFrame = rSpace.replace(/<i>/g, '').replace(/<\/i>/g, '');
        let rRef = rIFrame.replace(/<ref>/g, '  <').replace(/<ref >/g, '<');
        let rRef2 = rRef.replace(/<\/ref>/g, '>');
        let rDash = rRef2.replace(/ - /g, ',');
        let rLB = rDash.replace(/\[\[/g, '');
        let rRB = rLB.replace(/\]\]/g, '');

        // console.log(rRB)

        // # ======= this is POST-EDITING print =======
        let lines = rRB.split("\n")

        // start attribute grabbing from cards ==================
        let extraSpace1 = '{\n'
        // let charWikiLink = (wikiURL).replace('?action=edit', "")
        let charThumb = []
        let charArt = []
        let charName1 = []
        let charName2 = []
        let charRarity = []
        let charType = []
        let charCost = []
        let charID = []
        let charLS = []
        let charLSEza = []
        let charSaType = []
        let charSaName = []
        let charSaDesc = []
        let charSaDescEza = []
        let charUltraType = []
        let charUltraName = []
        let charUltraDesc = []
        let charUltraDescEza = []
        let charPsName = []
        let charPsDesc = []
        let charPsDescEza = []
        let charASType = []
        let charASName = []
        let charAS = []
        let charASCond = []
        let charASCondEza = []
        let charTransformType = []
        let charTransformCond = []
        let charTransformCondEza = []
        let charStandbyname = []
        let charStandbydescription = []
        let charStandbydescriptioneza = []
        let charStandbycondition = []
        let charStandbyconditioneza = []
        let charFinishattack1name = []
        let charFinishattack1description = []
        let charFinishattack1descriptioneza = []
        let charFinishattack1condition = []
        let charFinishattack1conditioneza = []
        let charFinishattack2name = []
        let charFinishattack2description = []
        let charFinishattack2descriptioneza = []
        let charFinishattack2condition = []
        let charFinishattack2conditioneza = []
        let charTransformed = []
        let charTransformto = []
        let charTransformedfrom = []
        let charKi12 = []
        let charKi24 = []
        let charLinkSkills = []
        let charCategories = []
        let charJPDate = []
        let charGLBDate = []
        let charJPDateEza = []
        let charGLBDateEza = []
        let extraSpace2 = '},\n'


        for (let i = 0; i < lines.length; i++) {
            let myline = lines[i]
            if (myline.includes('|thumb:')){
                charThumb.push(myline.replace('|thumb:', '').replace(':', '', 1).replace('" ','').replace('" ','').replace('\n', ',\n'))            
            }
            if (myline.includes('|artwork link:')){
                charArt.push(myline.replace('|artwork link:', '').replace('artwork link','art').replace(':', '', 1).replace('" ','').replace('" ','').replace('\n', ',\n'))
            }
            if (myline.includes('|name1: ')){
                charName1.push(myline.replace('|name1: ', '').replace("name1", 'title').replace(':', '"', 1).replace('" ','').replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|name2:')){
                charName2.push(myline.replace('|name2', '').replace("name2", 'name').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|rarity:')){
                charRarity.push(myline.replace('|rarity', '').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|type:')){
                charType.push(myline.replace('|type', '').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|cost:')){
                charCost.push(myline.replace('|cost', '').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|ID:')){
                charID.push(myline.replace('|ID', '').replace('ID', 'id').replace(':', '', 1).replace('\n', ',\n'))
            }
            if (myline.includes('|LS description:')){
                charLS.push(myline.replace('|LS description', '').replace("LS description", "ls_description").replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|LS description Z:')){
                charLSEza.push(myline.replace('|LS description Z', '').replace("LS description Z", "ls_description_eza").replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|SA type:')){
                charSaType.push(myline.replace('|SA type', '').replace('SA type', 'sa_type').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|SA name:')){
                charSaName.push(myline.replace('|SA name', '').replace('SA name', 'sa_name').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|SA description:')){
                charSaDesc.push(myline.replace('|SA description', '').replace('SA description', 'sa_description').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|SA description Z:')){
                charSaDescEza.push(myline.replace('|SA description Z', '').replace('SA description Z', 'sa_description_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|UltraSA type:')){
                charUltraType.push(myline.replace('|UltraSA type', '').replace('UltraSA type', 'ultra_sa_type').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|UltraSA name:')){
                charUltraName.push(myline.replace('|UltraSA name', '').replace('UltraSA name', 'ultra_sa_name').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|UltraSA description:')){
                charUltraDesc.push(myline.replace('|UltraSA description', '').replace('UltraSA description', 'ultra_sa_description').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|UltraSA description Z:')){
                charUltraDescEza.push(myline.replace('|UltraSA description Z', '').replace('UltraSA description Z', 'ultra_sa_description_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|PS name:')){
                charPsName.push(myline.replace('|PS name', '').replace('PS name', 'ps_name').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|PS description:')){
                charPsDesc.push(myline.replace('|PS description', '').replace('PS description', 'ps_description').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|PS description Z:')){
                charPsDescEza.push(myline.replace('|PS description Z', '').replace('PS description Z', 'ps_description_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|SA type Active:')){
                charASType.push(myline.replace('|SA type Active', '').replace('SA type Active', 'sa_type_active').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Active skill name:')){
                charASName.push(myline.replace('|Active skill name', '').replace('Active skill name', 'active_skill_name').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Active skill:')){
                charAS.push(myline.replace('|Active skill', '').replace('Active skill', 'active_skill').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Active skill condition:')){
                charASCond.push(myline.replace('|Active skill condition', '').replace('Active skill condition', 'active_skill_condition').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Active skill condition Z:')){
                charASCondEza.push(myline.replace('|Active skill condition Z', '').replace('Active skill condition Z', 'active_skill_condition_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Transform type:')){
                charTransformType.push(myline.replace('|Transform type', '').replace('Transform type', 'transform_type').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Transform condition:')){
                charTransformCond.push(myline.replace('|Transform condition', '').replace('Transform condition', 'transform_condition').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Transform condition Z:')){
                charTransformCondEza.push(myline.replace('|Transform condition Z', '').replace('Transform condition Z', 'transform_condition_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Standby name:')){
                charStandbyname.push(myline.replace('|Standby name', '').replace('Standby name', 'standby_name').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Standby description:')){
                charStandbydescription.push(myline.replace('|Standby description', '').replace('Standby description', 'standby_description').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Standby description Z:')){
                charStandbydescriptioneza.push(myline.replace('|Standby description Z', '').replace('Standby description Z', 'standby_condition_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Standby condition:')){
                charStandbycondition.push(myline.replace('|Standby condition', '').replace('Standby condition', 'standby_condition').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Standby condition Z:')){
                charStandbyconditioneza.push(myline.replace('|Standby condition Z', '').replace('Standby condition Z', 'standby_condition_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Finish attack 1 name:')){
                charFinishattack1name.push(myline.replace('|Finish attack 1 name', '').replace('Finish attack 1 name', 'finish_attack_1_name').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Finish attack 1 description:')){
                charFinishattack1description.push(myline.replace('|Finish attack 1 description', '').replace('Finish attack 1 description', 'finish_attack_1_description').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Finish attack 1 description Z:')){
                charFinishattack1descriptioneza.push(myline.replace('|Finish attack 1 description Z', '').replace('Finish attack 1 description Z', 'finish_attack_1_description_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Finish attack 1 condition:')){
                charFinishattack1condition.push(myline.replace('|Finish attack 1 condition', '').replace('Finish attack 1 condition', 'finish_attack_1_condition').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Finish attack 1 condition Z:')){
                charFinishattack1conditioneza.push(myline.replace('|Finish attack 1 condition Z', '').replace('Finish attack 1 condition Z', 'finish_attack_1_condition_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Finish attack 2 name:')){
                charFinishattack2name.push(myline.replace('|Finish attack 2 name', '').replace('Finish attack 2 name', 'finish_attack_1_name').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Finish attack 2 description:')){
                charFinishattack2description.push(myline.replace('|Finish attack 2 description', '').replace('Finish attack 2 description', 'finish_attack_1_description').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Finish attack 2 description Z:')){
                charFinishattack2descriptioneza.push(myline.replace('|Finish attack 2 description Z', '').replace('Finish attack 2 description Z', 'finish_attack_1_description_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Finish attack 2 condition:')){
                charFinishattack2condition.push(myline.replace('|Finish attack 2 condition', '').replace('Finish attack 2 condition', 'finish_attack_1_condition').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|Finish attack 2 condition Z:')){
                charFinishattack2conditioneza.push(myline.replace('|Finish attack 2 condition Z', '').replace('Finish attack 2 condition Z', 'finish_attack_1_condition_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|12 ki:')){
                charKi12.push(myline.replace('|12 ki', '').replace('12 ki', 'Ki12').replace(':', '"', 1).replace('" ','').replace('\n', '",\n').replace('%',''))
            }
            if (myline.includes('|24 ki:')){
                charKi24.push(myline.replace('|24 ki', '').replace('24 ki', 'Ki24').replace(':', '"', 1).replace('" ','').replace('\n', '",\n').replace('%',''))
            }
            if (myline.includes('|Link skill:')){
                charLinkSkills.push(myline.replace('|Link skill', '').replace('Link skill', 'link_skill').replace('" ', '').replace(': ', '', 1).replace('\n', ',\n'))
            }
            if (myline.includes('|Category:')){
                charCategories.push(myline.replace('|Category', '').replace('Category', 'category').replace('" ', '').replace(': ', '', 1).replace('\n', ',\n'))
            }
            if (myline.includes('|JPdate: ')){
                charJPDate.push(myline.replace('|JPdate', '').replace('JPdate', 'jp_date').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|GLBdate: ')){
                charGLBDate.push(myline.replace('|GLBdate', '').replace('GLBdate', 'glb_date').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|JPdateEZA: ')){
                charJPDateEza.push(myline.replace('|JPdateEZA', '').replace('JPdateEZA', 'jp_date_eza').replace(':', '"', 1).replace('" ','').replace('\n', '",\n'))
            }
            if (myline.includes('|GLBdateEZA: ')){
                charGLBDateEza.push(myline.replace('|GLBdateEZA', '').replace('GLBdateEZA', 'glb_date_eza').replace(':', '"', 1).replace('" ','').replace('\n', '"\n'))
            }
            }
            
            if (charThumb === ['"thumb": ,'] || charThumb.length === 0){
                charThumb = [null]
            }
            if (charArt === [] || charArt.length === 0){
                charArt = [null]
            }
            if (charName1 === [] || charName1.length === 0){
                charName1 = [null]
            }
            if (charName2 === [] || charName2.length === 0){
                charName2 = [null]
            }
            if (charRarity === [] || charRarity.length === 0){
                charRarity = [null]
            }
            if (charType === [] || charType.length === 0){
                charType = [null]
            }
            if (charCost === [] || charCost.length === 0){
                charCost = [null]
            }
            if (charID === [] || charID.length === 0){
                charID = [null]
            }
            if (charLS === [] || charLS.length === 0){
                charLS = [null]
            }
            if (charLSEza === [] || charLSEza.length === 0){
                charLSEza = [null]
            }
            if (charSaType === [] || charSaType.length === 0){
                charSaType = [null]
            }
            if (charSaName === [] || charSaName.length === 0){
                charSaName = [null]
            }
            if (charSaDesc === [] || charSaDesc.length === 0){
                charSaDesc = [null]
            }
            if (charSaDescEza === [] || charSaDescEza.length === 0){
                charSaDescEza = [null]
            }
            if (charUltraType === [] || charUltraType.length === 0){
                charUltraType = [null]
            }
            if (charUltraName === [] || charUltraName.length === 0){
                charUltraName = [null]
            }
            if (charUltraDesc === [] || charUltraDesc.length === 0){
                charUltraDesc = [null]
            }
            if (charUltraDescEza === [] || charUltraDescEza.length === 0){
                charUltraDescEza = [null]
            }
            if (charPsDescEza === [] || charPsDescEza.length === 0){
                charPsDescEza = [null]
            }
            if (charPsName === [] || charPsName.length === 0){
                charPsName = [null]
            }
            if (charPsDesc === [] || charPsDesc.length === 0){
                charPsDesc = [null]
            }
            if (charPsDescEza === [] || charPsDescEza.length === 0){
                charPsDescEza = [null]
            }
            if (charASType === [] || charASType.length === 0){
                charASType = [null]
            }
            if (charASName === [] || charASName.length === 0){
                charASName = [null]
            }
            if (charAS === [] || charAS.length === 0){
                charAS = [null]
            }
            if (charASCond === [] || charASCond.length === 0){
                charASCond = [null]
            }
            if (charASCondEza === [] || charASCondEza.length === 0){
                charASCondEza = [null]
            }
            if (charTransformType === [] || charTransformType.length === 0){
                charTransformType = [null]
            }
            if (charTransformCond.length === 0){
                charTransformCond = [null]
            }
            if (charTransformCondEza.length === 0){
                charTransformCondEza = [null]
            }
            if (charStandbyname === [] || charStandbyname.length === 0){
                charStandbyname = [null];
            }
            if (charStandbydescription === [] || charStandbydescription.length === 0){
                charStandbydescription = [null];
            }
            if (charStandbydescriptioneza === [] || charStandbydescriptioneza.length === 0){
                charStandbydescriptioneza = [null];
            }
            if (charStandbycondition === [] || charStandbycondition.length === 0){
                charStandbycondition = [null];
            }
            if (charStandbyconditioneza === [] || charStandbyconditioneza.length === 0){
                charStandbyconditioneza = [null];
            }
            if (charFinishattack1name === [] || charFinishattack1name.length === 0){
                charFinishattack1name = [null];
            }
            if (charFinishattack1description === [] || charFinishattack1description.length === 0){
                charFinishattack1description = [null];
            }
            if (charFinishattack1descriptioneza === [] || charFinishattack1descriptioneza.length === 0){
                charFinishattack1descriptioneza = [null];
            }
            if (charFinishattack1condition === [] || charFinishattack1condition.length === 0){
                charFinishattack1condition = [null];
            }
            if (charFinishattack1conditioneza === [] || charFinishattack1conditioneza.length === 0){
                charFinishattack1conditioneza = [null];
            }
            if (charFinishattack2name === [] || charFinishattack2name.length === 0){
                charFinishattack2name = [null];
            }
            if (charFinishattack2description === [] || charFinishattack2description.length === 0){
                charFinishattack2description = [null];
            }
            if (charFinishattack2descriptioneza === [] || charFinishattack2descriptioneza.length === 0){
                charFinishattack2descriptioneza = [null];
            }
            if (charFinishattack2condition === [] || charFinishattack2condition.length === 0){
                charFinishattack2condition = [null];
            }
            if (charFinishattack2conditioneza === [] || charFinishattack2conditioneza.length === 0){
                charFinishattack2conditioneza = [null];
            }
            if (charKi12 === [] || charKi12.length === 0){
                charKi12 = [null];
            }
            if (charKi24 === [] || charKi24.length === 0){
                charKi24 = [null];
            }            
            if (charLinkSkills.length === 0){
                charLinkSkills = [null]
            }
            if (charCategories.length === 0){
                charCategories = [null]
            }
            if (charJPDate.length === 0){
                charJPDate = [null]
            }
            if (charGLBDate.length === 0){
                charGLBDate = [null]
            }
            if (charJPDateEza.length === 0){
                charJPDateEza = [null] 
            }
            if (charGLBDateEza.length === 0){
                charGLBDateEza = [null]
            }

            const results = {
                // charWikiLink: charWikiLink,
                id: charID[0],
                thumb: charThumb[0],
                art: charArt[0],
                title: charName1[0],
                name: charName2[0],
                rarity: charRarity[0],
                type: charType[0],
                cost: charCost[0],
                ls_description: charLS[0],
                ls_description_eza: charLSEza[0],
                sa_type: charSaType[0],
                sa_name: charSaName[0],
                sa_description: charSaDesc[0],
                sa_description_eza: charSaDescEza[0],
                ultra_sa_type: charUltraType[0],
                ultra_sa_name: charUltraName[0],
                ultra_sa_description: charUltraDesc[0],
                ultra_sa_description_eza: charUltraDescEza[0],
                ps_name: charPsName[0],
                ps_description: charPsDesc[0],
                ps_description_eza: charPsDescEza[0],
                sa_type_active: charASType[0],
                active_skill_name: charASName[0],
                active_skill: charAS[0],
                active_skill_condition: charASCond[0],
                active_skill_condition_eza: charASCondEza[0],
                transform_type: charTransformType[0],
                transform_condition: charTransformCond[0],
                transform_condition_eza: charTransformCondEza[0],
                standby_name: charStandbyname[0],
                standby_description: charStandbydescription[0],
                standby_description_eza: charStandbydescriptioneza[0],
                standby_condition: charStandbycondition[0],
                standby_condition_eza: charStandbyconditioneza[0],
                finish_attack_1_name: charFinishattack1name[0],
                finish_attack_1_description: charFinishattack1description[0],
                finish_attack_1_description_eza: charFinishattack1descriptioneza[0],
                finish_attack_1_condition: charFinishattack1condition[0],
                finish_attack_1_condition_eza: charFinishattack1conditioneza[0],
                finish_attack_2_name: charFinishattack2name[0],
                finish_attack_2_description: charFinishattack2description[0],
                finish_attack_2_description_eza: charFinishattack2descriptioneza[0],
                finish_attack_2_condition: charFinishattack2condition[0],
                finish_attack_2_condition_eza: charFinishattack2conditioneza[0],
                transformed: false,
                transform_to: null,
                transformed_from: null,
                Ki12: charKi12[0],
                Ki24: charKi24[0],
                link_skill: charLinkSkills[0],
                category: charCategories[0],
                jp_date: charJPDate[0],
                glb_date: charGLBDate[0],
                jp_date_eza: charJPDateEza[0],
                glb_date_eza: charGLBDateEza[0]
            }; 
            return results
        }