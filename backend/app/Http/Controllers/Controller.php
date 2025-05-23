<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;


    /**
     * @OA\Info(
     *     version="1.0.0",
     *     title="API LiqaaSpace",
     *     description="Documentation de l'API LiqaaSpace",
     *     @OA\Contact(
     *         email="contact@liqaaspace.com",
     *         name="Équipe LiqaaSpace"
     *     ),
     *     @OA\License(
     *         name="Apache 2.0",
     *         url="http://www.apache.org/licenses/LICENSE-2.0.html"
     *     )
     * )
     * @OA\Server(
     *     url=L5_SWAGGER_CONST_HOST,
     *     description="API Server"
     * )
     * @OA\Tag(
     *     name="Salles",
     *     description="Opérations sur les salles"
     * )
     * @OA\Tag(
     *     name="Réservations",
     *     description="Opérations sur les réservations"
     * )
     * @OA\Tag(
     *     name="Authentification",
     *     description="Authentification des utilisateurs"
     * )
     */

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
