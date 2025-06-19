import React,{memo,lazy,Suspense} from 'react'

const Index = lazy(() => import('../views/dashboard/index'))

const BoxedFancyRouter = memo(() => {
    return (
        <Suspense fallback={<div className="react-load"></div>}>
            <Index />
        </Suspense>
    )
}
)

BoxedFancyRouter.displayName="BoxedFancyRouter"
export default BoxedFancyRouter
