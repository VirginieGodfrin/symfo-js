<?php

namespace AppBundle\Controller;

use AppBundle\Entity\RepLog;
use AppBundle\Form\Type\RepLogType;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class LiftController extends BaseController
{
    /**
     * @Route("/lift", name="lift")
     */
    public function indexAction(Request $request)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_REMEMBERED');

        $form = $this->createForm(RepLogType::class);
        $form->handleRequest($request);

        if ($form->isValid()) {
            $em = $this->getDoctrine()->getManager();
            $repLog = $form->getData();
            $repLog->setUser($this->getUser());

            $em->persist($repLog);
            $em->flush();

            // ajout d'une ligne dans le tab en cas de succès
            if ($request->isXmlHttpRequest()) {
                return $this->render('lift/_repRow.html.twig', [
                'repLog' => $repLog
                ]); 
            }
            $this->addFlash('notice', 'Reps crunched!');
            return $this->redirectToRoute('lift');
        }

        $repLogs = $this->getDoctrine()->getRepository('AppBundle:RepLog')
            ->findBy(array('user' => $this->getUser()))
        ;
        $totalWeight = 0;
        foreach ($repLogs as $repLog) {
            $totalWeight += $repLog->getTotalWeightLifted();
        }
 
        // si la réponse est une requête XML dans le cas d'une erreur de validation
        // if ($request->isXmlHttpRequest()) { 

        //     return $this->render('lift/_repRow.html.twig', [
        //         'repLog' => $repLog
        //     ]);
        //  render renvoie une reponse http 200 même en cas d'erreur (success)
        // }

        if ($request->isXmlHttpRequest()) {
            // $html prend pour valeur la vue du formulaire 
            $html = $this->renderView('lift/_form.html.twig', [ 
                'form' => $form->createView()
            ]);
            // et est retournée avec un une réponse http 400 (error)
            return new Response($html, 400);
        }

        return $this->render('lift/index.html.twig', array(
            'form' => $form->createView(),
            'repLogs' => $repLogs,
            'leaderboard' => $this->getLeaders(),
            'totalWeight' => $totalWeight,
        ));
    }

    /**
     * Returns an array of leader information
     *
     * @return array
     */
    private function getLeaders()
    {
        $leaderboardDetails = $this->getDoctrine()->getRepository('AppBundle:RepLog')
            ->getLeaderboardDetails()
        ;

        $userRepo = $this->getDoctrine()->getRepository('AppBundle:User');
        $leaderboard = array();
        foreach ($leaderboardDetails as $details) {
            if (!$user = $userRepo->find($details['user_id'])) {
                // interesting, this user is missing...
                continue;
            }

            $leaderboard[] = array(
                'username' => $user->getUsername(),
                'weight' => $details['weightSum'],
                'in_cats' => number_format($details['weightSum']/RepLog::WEIGHT_FAT_CAT),
            );
        }

        return $leaderboard;
    }
}
