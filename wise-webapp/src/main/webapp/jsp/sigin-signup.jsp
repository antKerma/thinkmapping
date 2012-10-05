<%@page pageEncoding="UTF-8" %>
<%@include file="/jsp/init.jsp" %>

<!DOCTYPE html>



<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="fr" lang="fr">
<head>
    <base href="${baseURL}/">
    <title>Think Mapping - Service de Mind mapping</title>
    <meta name="description" content="Gagnez en productivité en organisant votre réflexion gratuitement." />
    <meta name="keywords" content="Mind Map, Mind Mapping, think mapping, productivité, organiser, schéma, structurer" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <!--DEBUG IE 6, 7 ET 8 LIKE BOX-->
    <!--[if IE 6]>
    <html id="ie6" dir="ltr" lang="fr-FR" xmlns:fb="http://www.facebook.com/2008/fbml">
    <![endif]-->
    <!--[if IE 7]>
    <html id="ie7" dir="ltr" lang="fr-FR" xmlns:fb="http://www.facebook.com/2008/fbml">
    <![endif]-->
    <!--[if IE 8]>
    <html id="ie8" dir="ltr" lang="fr-FR" xmlns:fb="http://www.facebook.com/2008/fbml">
    <![endif]-->
    <!--[if !(IE 6) | !(IE 7) | !(IE 8)  ]><!-->
    <!--<![endif]-->

    <link rel="stylesheet" href="css/signin-signup.css" />
    <link href='http://fonts.googleapis.com/css?family=Cabin' rel='stylesheet' type='text/css'>
    <script type="text/javascript" language="javascript" src="js/jquery-1.7.2.min.js"></script>

    <!--Formulaires Clear des inputs-->
    <script type="text/javascript" src="js/jquery.placeholder.min.js"></script>
    <script type="text/javascript" src="js/jquery.placeholder.js"></script>

    <!--FANCYBOX-->
    <script type="text/javascript" src="js/jquery.fancybox.js?v=2.0.6"></script>
    <link rel="stylesheet" type="text/css" href="css/jquery.fancybox.css" media="screen" />
    <!--END FANCYBOX-->

    <!--[if lt IE 9]>
    <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->

    <!--[if lte IE 7]>
    <link rel="stylesheet" href="css/ie7.css" />
    <![endif]-->

</head>
<body id="homepage">
<!--facebook-->

<div id="fb-root"></div>
<script>
    window.fbAsyncInit = function() {
        FB.init({
            appId  : '154510314613951',
            status : true,
            cookie : true,
            xfbml  : true
        });
    };
    (function() {
        var e = document.createElement('script');
        e.src = document.location.protocol + '//connect.facebook.net/fr_FR/all.js';
        e.async = true;
        document.getElementById('fb-root').appendChild(e);
    }());

    $(document).ready(function(){
        //Popin register
        $("#calltoregister").fancybox('#register-form');

        //Popin settings
        $("#call-settings a").fancybox('#settings');

        //Bouton annuler de la popin
        $('.cancel').live('click',function(){
            $.fancybox.close();
            return false;
        });

        //Slide de presentation
        if($.browser.mozilla) { mybrowser = "Firefox"; }
        if($.browser.webkit) { mybrowser = "Webkit"; }
        if($.browser.msie) { mybrowser = "Internet Explorer"; }
        if($.browser.opera) { mybrowser = "Opera"; }
        switch(mybrowser) {
            case "Firefox":
                jQuery(".slider-mac").append('<iframe src="html/animation-html5.html" width="407px" height="261px" style="border:none;"></iframe>');
                break;
            case "Webkit":
                jQuery(".slider-mac").append('<iframe src="html/animation-html5.html" width="407px" height="261px" style="border:none;"></iframe>');
                break;
            case "Internet Explorer":
                jQuery(".slider-mac").append('<iframe src="html/animation.html" width="407px" height="270px"></iframe>');
                break;
            case "Opera":
                jQuery(".slider-mac").append('<iframe src="html/animation.html" width="407px" height="262px"></iframe>');
                break;
            default:
                break;
        }

        //CLEAR DES FORMULAIRES
        $('input[placeholder], textarea[placeholder]').placeholder();
    });

</script>
<header>
    <div class="wrapper">
        <a id="logo" href="index.html"><img src="/images/thinkmapping-logo.png" alt="Think Mapping" title="Think Mapping" /></a>
    </div><!--END WRAPPER-->
</header>
<section id="content">
    <div class="wrapper">
        <aside id="description">
            <h1>Think Mapping</h1>
            <h2><strong>1ère plateforme <span>communautaire</span> dédiée au Mind Mapping !</strong><br />
                <em><span>Pensée</span> et <span>construite</span> avec les utilisateurs.</em>
            </h2>
            <strong class="category-title">Accédez à vos Think Maps</strong>
            <div id="register">
                <form action="<c:url value='/c/j_spring_security_check'/>" method="POST" id="login-form">
                    <input type="email" name='j_username' placeholder="Adresse email" />

                    <input type="password" id="password-login" name='j_password' placeholder="Mot de passe" />


                    <input id="remind-me" type="checkbox" name="_spring_security_remember_me"/>

                    <label for="remind-me">Se souvenir de moi</label>
                    <a href="<c:url value="/c/user/resetPassword"/>">Mot de passe oublié ?</a>
                    <input type="submit" value="Go" />
                </form>
            </div><!--END REGISTER-->
            <a href="#register-full" id="calltoregister">
                <strong class="category-title">Créez votre compte gratuitement</strong>
                <span>Go !</span>
            </a>

            <div id="register-form" class="popin-bg" style="display:none;">

                <div id="register-full" class="popin">
                    <strong>Inscription à <span>ThinkMapping</span></strong>
                    <form method="post" action="#">

                        <label>Email <span>*</span></label>
                        <input type="email" placeholder="Adresse email" />

                        <label>Pseudo <span>*</span></label>
                        <input type="text" placeholder="Pseudo" />

                        <label>Prénom <span>*</span></label>
                        <input type="text" placeholder="Prénom" />

                        <label>Nom <span>*</span></label>
                        <input type="text" placeholder="Nom" />

                        <label>Mot de passe <span>*</span></label>
                        <input type="password" placeholder="Mot de passe" />

                        <label>Confirmation de mot de passe <span>*</span></label>
                        <input type="password" placeholder="Mot de passe" />

                        <input type="submit" value="Valider" placeholder="Valider" />
                    </form>
                    <a class="cancel" href="#" >Annuler</a>
                </div>

            </div>

        </aside><!--END DESCRIPTION-->

        <aside id="demo">
            <div id="bg-slider">
                <div class="slider-mac"> <!-- Contenu différent selon les navigateurs --> </div>
            </div>
        </aside>
    </div><!--END WRAPPER-->
</section><!--END CONTENT-->
<footer>
    <div class="wrapper">
        <aside id="projet" class="footer-part">
            <div class="footer-container">
                <h3>Notre Projet</h3>
                <strong><span>L' idée</span><br /></strong>
                <p>Vous permettre de structurer votre reflexion en groupe !</p>
            </div>
            <ul id="think">
                <li>
                    <img src="images/signin-signup/smart.png" alt="Think Smart"/>
                    <p><strong>Think Smart :</strong><br />
                        <span>Création assistée de Mind Mapping</span></p>
                </li>
                <li>
                    <img src="images/signin-signup/people.png" alt="Think people" />
                    <p><strong>Think people :</strong><br />
                        <span>Utilisation en mode collaboratif</span></p>
                </li>
                <li>
                    <img src="images/signin-signup/maps.png" alt="Think maps" />
                    <p><strong>Think maps :</strong><br />
                        <span>Une galerie de mind mapping multi thématiques (bilan de compétences, business plan, etc.)</span></p>
                </li>
            </ul>
        </aside>

        <aside id="thinkmaps" class="footer-part">
            <h3>Les ThinkMaps</h3>
            <div class="footer-container">
                <strong><span>Comment ?</span><br /></strong>
                <p>
                    Les Thinkmaps vous aident à structurer votre pensée en faisant travailler simultanément les deux hémisphères de votre cerveau.</p>
            </div>
            <div class="footer-container">
                <strong><span>Quand ?</span><br /></strong>
                <p>Recherche d’emploi, Création des startup, Gestion de projet…<br /> Progressez avec les Thinkmaps dans les domaines personnels, éducatifs et professionnels.</p>
            </div>
        </aside>
        <aside id="fb" class="footer-part">
            <h3>Ils aiment le projet</h3>
            <div class="fbcool"></div>
            <fb:fan profile_id="154510314613951" stream="0" connections="12" css="http://tm.agencehorizon.com/wp-content/themes/thinkmapping/css/style-facebook.css?2" logobar="0" height="328px" width="287px"></fb:fan>

        </aside>
        <aside id="contact" class="footer-part">
            <strong>Contact</strong>
            <div class="footer-container">
                <p>Pour poser une question ou donner un Feedback sur l’outil : <a href="mailto:support@thinkmapping.com">support@thinkmapping.com</a></p>
            </div>
        </aside>


    </div><!--END WRAPPER-->
    <section id="colophon">
        <a href="#">Mentions légales</a>
    </section>
</footer>
</body>
</html>